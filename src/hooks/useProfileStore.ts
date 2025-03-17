import {makeAutoObservable} from 'mobx';
import {profileApi} from '../services/mock/profile';
import type {UserProfile, UserListItem} from '../services/mock/profile';

class ProfileStore {
  profile: UserProfile | null = null;
  followers: UserListItem[] = [];
  following: UserListItem[] = [];
  loading = false;
  updating = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProfile() {
    this.loading = true;
    try {
      const data = await profileApi.getUserProfile();
      this.profile = data;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async fetchFollowers() {
    this.loading = true;
    try {
      const data = await profileApi.getFollowers();
      this.followers = data;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async fetchFollowing() {
    this.loading = true;
    try {
      const data = await profileApi.getFollowing();
      this.following = data;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async followUser(userId: number) {
    this.updating = true;
    try {
      const success = await profileApi.followUser(userId);
      if (success) {
        // 更新粉丝列表中的状态
        const follower = this.followers.find(f => f.id === userId);
        if (follower) {
          follower.isFollowing = true;
        }
        // 更新关注列表中的状态
        const following = this.following.find(f => f.id === userId);
        if (following) {
          following.isFollowing = true;
        }
        // 更新个人资料中的关注数
        if (this.profile) {
          this.profile.following += 1;
        }
      }
      return success;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      this.updating = false;
    }
  }

  async unfollowUser(userId: number) {
    this.updating = true;
    try {
      const success = await profileApi.unfollowUser(userId);
      if (success) {
        // 更新粉丝列表中的状态
        const follower = this.followers.find(f => f.id === userId);
        if (follower) {
          follower.isFollowing = false;
        }
        // 更新关注列表中的状态
        const following = this.following.find(f => f.id === userId);
        if (following) {
          following.isFollowing = false;
        }
        // 更新个人资料中的关注数
        if (this.profile) {
          this.profile.following -= 1;
        }
      }
      return success;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      this.updating = false;
    }
  }

  async updateProfile(profile: Partial<UserProfile>) {
    this.updating = true;
    try {
      const success = await profileApi.updateProfile(profile);
      if (success && this.profile) {
        this.profile = {...this.profile, ...profile};
      }
      return success;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      this.updating = false;
    }
  }
}

const profileStore = new ProfileStore();

export const useProfileStore = () => profileStore; 