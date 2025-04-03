/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockEventApi } from './mock/events';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 模拟 API 响应数据
const mockPosts = [
  {
    id: 1,
    username: 'user1',
    avatar: 'https://picsum.photos/40',
    image: 'https://picsum.photos/400',
    likes: 234,
    caption: '美好的一天 ☀️',
    comments: 45,
  },
  {
    id: 2,
    username: 'user2',
    avatar: 'https://picsum.photos/41',
    image: 'https://picsum.photos/401',
    likes: 567,
    caption: '分享生活点滴 🌈',
    comments: 89,
  },
];

// 导出用户相关的API
export const userApi = {
  // 获取国家列表
  getCountries: async () => {
    try {
      const response = await api.get('/user/locations/countries');
      if (response.data.code === 200) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('获取国家列表失败:', error);
      return [];
    }
  },

  // 根据国家代码获取省份列表
  getRegions: async (countryCode: string) => {
    try {
      const response = await api.get(`/user/locations/regions?countryCode=${countryCode}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`获取${countryCode}省份列表失败:`, error);
      return [];
    }
  },

  // 编辑用户信息
  updateUserProfile: async (userId: number, profileData: Partial<{
    userCountry: string;
    userRegions: string;
    userCity: string;
    userField: string;
    levelOfStudy: string;
    userUni: string;
    userLanguage: string;
  }>) => {
    try {
      const response = await api.put(`/user/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },

  // 获取用户的peer match信息
  getPeerMatchInfo: async (userId: number) => {
    try {
      const response = await api.get(`/user/peerMatchInfo/${userId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('获取用户peer match信息失败:', error);
      return null;
    }
  },

  // 根据大学、城市等获取相似用户
  getRandomUsers: async (page: number = 1, size: number = 10, params: Partial<{
    university: string;
    city: string;
    field: string;
  }>) => {
    try {
      const queryParams = new URLSearchParams({
        current: page.toString(),
        size: size.toString(),
        ...params,
      });
      
      const response = await api.get(`/user/randomPage?${queryParams}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      return { records: [], total: 0, size, current: page, pages: 0 };
    } catch (error) {
      console.error('获取随机用户失败:', error);
      return { records: [], total: 0, size, current: page, pages: 0 };
    }
  }
};

// 导出事件相关的API
export const eventApi = {
  // 获取事件列表
  getEvents: async () => {
    try {
      //const response = await api.get('/event/list');
      const response = await mockEventApi.getEvents();
      if (response.code === 200) {
        return response.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          description: event.description,
          image: event.img || 'https://picsum.photos/400/200',
          location: 'Sydney', // 接口中没有这个字段，模拟一个
          time: new Date(event.date).toLocaleTimeString(), // 从日期中提取时间
          attendees: 30, // 接口中没有这个字段，模拟一个
          isRegistered: false, // 接口中没有这个字段，模拟一个
          externalLink: event.externalLink,
        }));
      }
      return [];
    } catch (error) {
      console.error('获取事件列表失败:', error);
      return [];
    }
  },

  // 分页获取事件列表
  getEventsPage: async (page: number = 1, size: number = 10) => {
    try {
      const response = await api.get(`/event/page?current=${page}&size=${size}`);
      if (response.data.code === 200) {
        return {
          ...response.data.data,
          records: response.data.data.records.map((event: any) => ({
            id: event.id,
            title: event.title,
            date: event.date,
            description: event.description,
            image: event.img || 'https://picsum.photos/400/200',
            location: 'Sydney', // 接口中没有这个字段，模拟一个
            time: new Date(event.date).toLocaleTimeString(), // 从日期中提取时间
            attendees: 30, // 接口中没有这个字段，模拟一个
            isRegistered: false, // 接口中没有这个字段，模拟一个
            externalLink: event.externalLink,
          }))
        };
      }
      return { records: [], total: 0, size, current: page, pages: 0 };
    } catch (error) {
      console.error('分页获取事件列表失败:', error);
      return { records: [], total: 0, size, current: page, pages: 0 };
    }
  },

  // 获取事件详情
  getEventById: async (id: number) => {
    try {
      const response = await api.get(`/event/detail/${id}`);
      if (response.data.code === 200) {
        const event = response.data.data;
        return {
          id: event.id,
          title: event.title,
          date: event.date,
          description: event.description,
          image: event.img || 'https://picsum.photos/400/200',
          location: 'Sydney', // 接口中没有这个字段，模拟一个
          time: new Date(event.date).toLocaleTimeString(), // 从日期中提取时间
          attendees: 30, // 接口中没有这个字段，模拟一个
          isRegistered: false, // 接口中没有这个字段，模拟一个
          externalLink: event.externalLink,
        };
      }
      return null;
    } catch (error) {
      console.error(`获取事件${id}详情失败:`, error);
      return null;
    }
  },

  // 模拟注册事件（接口文档中未提供此接口）
  registerEvent: async (id: number) => {
    // 模拟成功
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  },

  // 模拟取消注册事件（接口文档中未提供此接口）
  unregisterEvent: async (id: number) => {
    // 模拟成功
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
};

// 导出好友相关的API
export const friendApi = {
  // 发送好友请求
  sendFriendRequest: async (userId: number, friendId: number) => {
    try {
      const response = await api.post('/friends/request', { userId, friendId });
      return response.data.code === 200;
    } catch (error) {
      console.error('发送好友请求失败:', error);
      return false;
    }
  },

  // 处理好友请求（接受或拒绝）
  processFriendRequest: async (userId: number, friendId: number, action: 'accept' | 'reject') => {
    try {
      const response = await api.post('/friends/process', { userId, friendId, action });
      return response.data.code === 200;
    } catch (error) {
      console.error('处理好友请求失败:', error);
      return false;
    }
  },

  // 获取好友请求列表
  getFriendRequests: async (userId: number) => {
    try {
      const response = await api.get(`/friends/requests/${userId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('获取好友请求列表失败:', error);
      return [];
    }
  },

  // 获取好友列表
  getFriendList: async (userId: number) => {
    try {
      const response = await api.get(`/friends/list/${userId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('获取好友列表失败:', error);
      return [];
    }
  }
};

// 导出消息相关的API
export const messageApi = {
  // 发送消息
  sendMessage: async (senderId: number, receiverId: number, content: string) => {
    try {
      const response = await api.post('/message', { senderId, receiverId, content });
      return response.data;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  },

  // 获取两个用户之间的聊天记录
  getMessagesBetweenUsers: async (user1Id: number, user2Id: number) => {
    try {
      const response = await api.get(`/message/between/${user1Id}/${user2Id}`);
      return response.data;
    } catch (error) {
      console.error('获取聊天记录失败:', error);
      return [];
    }
  }
};

// 导出用于帖子的API（保留原有接口）
export const postApi = {
  // 获取帖子列表
  getPosts: async () => {
    // 使用实际后端API替换，如果有的话
    // 暂时使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPosts;
  },

  // 获取单个帖子详情
  getPostById: async (id: number) => {
    // 使用实际后端API替换，如果有的话
    // 暂时使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPosts.find(post => post.id === id);
  },
};

export default api;
