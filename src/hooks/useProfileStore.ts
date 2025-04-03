import {makeAutoObservable} from 'mobx';
import {userApi, friendApi} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from './useAuthStore';

// 关注者用户类型
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

  // 初始化时从本地存储获取用户信息
  async init() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        this.profile = JSON.parse(userJson);
      }
    } catch (error) {
      console.error('初始化用户资料错误:', error);
    }
  }

  // 获取当前用户资料
  async fetchProfile() {
    // 如果已有用户资料，直接使用
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
      console.error('获取用户资料错误:', error);
    } finally {
      this.loading = false;
    }
  }

  // 更新用户资料
  async updateProfile(profileData: Partial<User>) {
    if (!this.profile?.id) {
      console.error('没有当前用户ID，无法更新资料');
      return false;
    }

    this.loading = true;
    try {
      const response = await userApi.updateUserProfile(this.profile.id, profileData);
      
      if (response.code === 200) {
        // 更新本地资料
        this.profile = {...this.profile, ...response.data};
        // 更新本地存储
        await AsyncStorage.setItem('user', JSON.stringify(this.profile));
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新用户资料错误:', error);
      return false;
    } finally {
      this.loading = false;
    }
  }

  // 获取当前用户的peer match信息
  async fetchPeerMatchInfo() {
    if (!this.profile?.id) {
      console.error('没有当前用户ID，无法获取peer match信息');
      return null;
    }

    try {
      const data = await userApi.getPeerMatchInfo(this.profile.id);
      return data;
    } catch (error) {
      console.error('获取peer match信息错误:', error);
      return null;
    }
  }

  // 获取相似用户
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
      console.error('获取相似用户错误:', error);
      return { records: [], total: 0, size, current: page, pages: 0 };
    } finally {
      this.loading = false;
    }
  }

  // 获取粉丝列表
  async fetchFollowers() {
    if (!this.profile?.id) return;
    
    this.loading = true;
    try {
      const response = await friendApi.getFriendList(this.profile.id);
      // 将返回数据转换为需要的格式
      this.followers = response.map((item: any) => ({
        id: item.Friend_ID,
        name: item.friend_name,
        avatar: `https://picsum.photos/id/${item.Friend_ID % 100}/200`,
        bio: "用户简介",
        isFollowing: false
      }));
    } catch (error) {
      console.error('获取粉丝列表错误:', error);
    } finally {
      this.loading = false;
    }
  }

  // 获取关注列表
  async fetchFollowing() {
    if (!this.profile?.id) return;
    
    this.loading = true;
    try {
      const response = await friendApi.getFriendList(this.profile.id);
      // 将返回数据转换为需要的格式
      this.following = response.map((item: any) => ({
        id: item.Friend_ID,
        name: item.friend_name,
        avatar: `https://picsum.photos/id/${item.Friend_ID % 100}/200`,
        bio: "用户简介",
        isFollowing: true
      }));
    } catch (error) {
      console.error('获取关注列表错误:', error);
    } finally {
      this.loading = false;
    }
  }

  // 关注用户
  async followUser(userId: number) {
    if (!this.profile?.id) return false;
    
    try {
      const success = await friendApi.sendFriendRequest(this.profile.id, userId);
      if (success) {
        // 更新用户状态
        const follower = this.followers.find(f => f.id === userId);
        if (follower) {
          follower.isFollowing = true;
        }
      }
      return success;
    } catch (error) {
      console.error('关注用户错误:', error);
      return false;
    }
  }

  // 取消关注
  async unfollowUser(userId: number) {
    if (!this.profile?.id) return false;
    
    try {
      // 这里假设使用'reject'动作来取消关注
      const success = await friendApi.processFriendRequest(this.profile.id, userId, 'reject');
      if (success) {
        // 更新用户状态
        const following = this.following.find(f => f.id === userId);
        if (following) {
          following.isFollowing = false;
        }
      }
      return success;
    } catch (error) {
      console.error('取消关注错误:', error);
      return false;
    }
  }
}

const profileStore = new ProfileStore();

export const useProfileStore = () => profileStore; 