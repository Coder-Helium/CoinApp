import {makeAutoObservable} from 'mobx';
import {userApi, friendApi} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from './useAuthStore';

// Follower user type
export interface FollowerUser {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
}

class ProfileStore {
  profile: User | null = null;
  followers: FollowerUser[] = [];
  following: FollowerUser[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  // Initialize: Get user information from local storage
  async init() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        this.profile = JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Error initializing user profile:', error);
    }
  }

  // Get current user profile
  async fetchProfile() {
    // If profile already exists, use it directly
    if (this.profile) {
      return;
    }

    this.loading = true;
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        this.profile = JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      this.loading = false;
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>) {
    if (!this.profile?.id) {
      console.error('No current user ID, cannot update profile');
      return false;
    }

    this.loading = true;
    try {
      const response = await userApi.updateUserProfile(this.profile.id, profileData);
      
      if (response.code === 200) {
        // Update local profile
        this.profile = {...this.profile, ...response.data};
        // Update local storage
        await AsyncStorage.setItem('user', JSON.stringify(this.profile));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    } finally {
      this.loading = false;
    }
  }

  // Get current user's peer match information
  async fetchPeerMatchInfo() {
    if (!this.profile?.id) {
      console.error('No current user ID, cannot fetch peer match information');
      return null;
    }

    try {
      const data = await userApi.getPeerMatchInfo(this.profile.id);
      return data;
    } catch (error) {
      console.error('Error fetching peer match information:', error);
      return null;
    }
  }

  // Get similar users
  async fetchRandomUsers(page: number = 1, size: number = 10, params: Partial<{
    university: string;
    city: string;
    field: string;
  }> = {}) {
    this.loading = true;
    try {
      const data = await userApi.getRandomUsers(page, size, params);
      return data;
    } catch (error) {
      console.error('Error fetching similar users:', error);
      return { records: [], total: 0, size, current: page, pages: 0 };
    } finally {
      this.loading = false;
    }
  }

  // Get followers list
  async fetchFollowers() {
    if (!this.profile?.id) return;
    
    this.loading = true;
    try {
      const response = await friendApi.getFriendList(this.profile.id);
      // Convert returned data to required format
      this.followers = response.map((item: any) => ({
        id: item.Friend_ID,
        name: item.friend_name,
        avatar: `https://picsum.photos/id/${item.Friend_ID % 100}/200`,
        bio: "User bio",
        isFollowing: false
      }));
    } catch (error) {
      console.error('Error fetching followers list:', error);
    } finally {
      this.loading = false;
    }
  }

  // Get following list
  async fetchFollowing() {
    if (!this.profile?.id) return;
    
    this.loading = true;
    try {
      const response = await friendApi.getFriendList(this.profile.id);
      // Convert returned data to required format
      this.following = response.map((item: any) => ({
        id: item.Friend_ID,
        name: item.friend_name,
        avatar: `https://picsum.photos/id/${item.Friend_ID % 100}/200`,
        bio: "User bio",
        isFollowing: true
      }));
    } catch (error) {
      console.error('Error fetching following list:', error);
    } finally {
      this.loading = false;
    }
  }

  // Follow user
  async followUser(userId: number) {
    if (!this.profile?.id) return false;
    
    try {
      const success = await friendApi.sendFriendRequest(this.profile.id, userId);
      if (success) {
        // Update user status
        const follower = this.followers.find(f => f.id === userId);
        if (follower) {
          follower.isFollowing = true;
        }
      }
      return success;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }

  // Unfollow user
  async unfollowUser(userId: number) {
    if (!this.profile?.id) return false;
    
    try {
      // Here we assume using 'reject' action to unfollow
      const success = await friendApi.processFriendRequest(this.profile.id, userId, 'reject');
      if (success) {
        // Update user status
        const following = this.following.find(f => f.id === userId);
        if (following) {
          following.isFollowing = false;
        }
      }
      return success;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }
}

const profileStore = new ProfileStore();

export const useProfileStore = () => profileStore; 