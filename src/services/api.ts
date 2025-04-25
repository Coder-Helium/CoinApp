/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockEventApi } from './mock/events';
import { mockUserDetail } from './mock/profile';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://54.252.49.201:8080/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加token
api.interceptors.request.use(
  async (config) => {
    //console.log('请求拦截器', config);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，处理常见错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API响应错误:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('请求超时');
    }
    if (error.message === 'Network Error') {
      console.error('网络连接错误，请检查网络状态');
    }
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
  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/user/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      return {
        code: 500,
        message: 'Network request failed. Please try again later.',
        data: null,
      };
    }
  },

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

  // Send email verification code
  sendVerificationCode: async (email: string) => {
    try {
      const response = await api.post('/user/register/sendVerifyCode', { email });
      return response.data;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        code: 500,
        message: 'Network request failed. Please try again later.',
        data: null,
      };
    }
  },

  // Verify email verification code
  verifyCode: async (email: string, code: string) => {
    try {
      const response = await api.post('/user/register/verifyCode', { email, code });
      return response.data;
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        code: 500,
        message: 'Network request failed. Please try again later.',
        data: null,
      };
    }
  },

  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    level_of_study: string | number;
    userCountry: string;
    userRegions: string;
    userCity: string;
    userField: string;
    userUni: string;
    userLanguage: string;
  }) => {
    try {
      // Convert level_of_study to number if it's a string
      const processedData = {
        ...userData,
        level_of_study: typeof userData.level_of_study === 'string' && userData.level_of_study !== ''
          ? parseInt(userData.level_of_study, 10)
          : userData.level_of_study,
      };

      const response = await api.post('/user/register', processedData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      return {
        code: 500,
        message: 'Network request failed. Please try again later.',
        data: null,
      };
    }
  },

  // Update user profile
  updateProfile: async (userId: number, profileData: Partial<{
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
      console.error('Error updating profile:', error);
      return {
        code: 500,
        message: 'Network request failed. Please try again later.',
        data: null,
      };
    }
  },

  // Logout user
  logout: async () => {
    // Client-side logout, no API call needed
    return {
      code: 200,
      message: 'Logout successful',
      data: null,
    };
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

  // 获取用户详细资料
  getUserDetail: async (userId: number) => {
    try {
      // 使用真实 API 的代码 (暂时注释)
      const response = await api.get(`/user/${userId}`);
      return response.data;

      // await new Promise(resolve => setTimeout(resolve, 300)); // 模拟网络延迟

      // // 在实际应用中，这里应该使用 userId 从服务器获取特定用户的资料
      // // 但在 mock 环境中，我们简单地返回预设的用户资料
      // return {
      //   code: 200,
      //   message: 'success',
      //   data: mockUserDetail,
      // };
    } catch (error) {
      console.error('获取用户详细资料失败:', error);
      throw error;
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
      // 使用真实 API 的代码 (暂时注释)
      // const response = await api.put(`/user/${userId}`, profileData);
      // return response.data;

      // 使用 mock 数据
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟网络延迟

      // 更新 mock 数据
      Object.assign(mockUserDetail, profileData);

      return {
        code: 200,
        message: 'Profile updated successfully',
        data: mockUserDetail,
      };
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
  getRandomUsers: async (page: number = 1, size: number = 10, userId: number, params: Partial<{
    university: string;
    city: string;
    field: string;
  }>) => {
    try {
      const queryParams = new URLSearchParams({
        current: page.toString(),
        size: size.toString(),
        userId: userId.toString(),
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
  },
};

// 导出事件相关的API
export const eventApi = {
  // 获取事件列表
  getEvents: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        console.warn('用户信息不存在，无法获取事件列表');
        return [];
      }

      try {
        const userData = JSON.parse(userJson);
        if (!userData || !userData.id) {
          console.warn('用户ID不存在，无法获取事件列表');
          return [];
        }

        const userId = userData.id;
        //console.log('发起事件列表请求，用户ID:', userId);

        const response = await api.get(`/event/list?userId=${userId}`);
        //console.log('事件列表响应:', response.status);

        if (response.data.code === 200) {
          return response.data.data.map((event: any, participants: any) => ({
            id: event.id,
            title: event.title,
            date: event?.date ? new Date(event.date).toLocaleDateString('zh-CN', {year: 'numeric', month: 'numeric', day: 'numeric'}) : '',
            description: event.description,
            image: event.image || 'https://picsum.photos/400/200',
            location: 'Sydney', // 接口中没有这个字段，模拟一个
            time: event.time || '12:00', // 使用事件自带的time或默认值
            attendees: participants, // 接口中没有这个字段，模拟一个
            isRegistered: false, // 接口中没有这个字段，模拟一个
            externalLink: event.externalLink,
          }));
        }
        console.warn('事件列表请求返回非200状态码:', response.data.code);
        return [];
      } catch (parseError) {
        console.error('解析用户信息失败:', parseError);
        return [];
      }
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
            date: event?.date ? new Date(event.date).toLocaleDateString('zh-CN', {year: 'numeric', month: 'numeric', day: 'numeric'}) : '',
            description: event.description,
            image: event.img || 'https://picsum.photos/400/200',
            location: 'Sydney', // 接口中没有这个字段，模拟一个
            time: new Date(event.date).toLocaleTimeString(), // 从日期中提取时间
            attendees: 30, // 接口中没有这个字段，模拟一个
            isRegistered: false, // 接口中没有这个字段，模拟一个
            externalLink: event.externalLink,
          })),
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
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        console.error('用户信息不存在');
        return null;
      }
      const userData = JSON.parse(userJson);
      const userId = userData.id;
      //console.log('user', userId);
      const response = await api.get(`/event/detail/${id}?userId=${userId}`);
      //const response = await mockEventApi.getEventById(id);
      if (response.data.code === 200) {
        const event = response.data.data.event;
        const participants = response.data.data.participants;
        //console.log('event', event);
        return {
          id: event?.id,
          title: event?.title,
          date: event?.date ? new Date(event.date).toLocaleDateString('zh-CN', {year: 'numeric', month: 'numeric', day: 'numeric'}) : '',
          description: event?.description,
          image: event?.image || 'https://picsum.photos/400/200',
          location: 'Sydney', // 接口中没有这个字段，模拟一个
          time: new Date(event?.date || '').toLocaleTimeString(), // 使用事件自带的time或默认值
          attendees: participants, // 接口中没有这个字段，模拟一个
          isRegistered: false, // 接口中没有这个字段，模拟一个
          externalLink: event?.externalLink,
        };
      }
      return null;
    } catch (error) {
      console.error(`获取事件${id}详情失败:`, error);
      return null;
    }
  },

  // 用户参加活动
  registerEvent: async (eventId: number, userId: number) => {
    try {
      const response = await api.post('/userEvent/attend', {
        eventId,
        userId,
      });
      //console.log('参加活动响应:', response);
      return response.data;
    } catch (error) {
      //console.error('参加活动失败:', error);
      return {
        code: 500,
        message: '参加活动请求失败，请稍后再试',
        data: null,
      };
    }
  },

  // 用户退出活动
  unregisterEvent: async (eventId: number, userId: number) => {
    try {
      const response = await api.post('/userEvent/quit', {
        eventId,
        userId,
      });
      //console.log('退出活动响应:', response);
      return response.data;
    } catch (error) {
      console.error('退出活动失败:', error);
      return {
        code: 500,
        message: '退出活动请求失败，请稍后再试',
        data: null,
      };
    }
  },

  // 获取活动参与者列表
  getEventAttendees: async (eventId?: number, myUserId?: number) => {
    try {
      // 使用真实API
      const response = await api.post('/event/attendanceList', { eventId, myUserId });
      console.log('attendanceList', response);
      if (response.data.code === 200) {
        return response.data.data.participants;
      }
      return [];
    } catch (error) {
      console.error(`获取活动${eventId}参与者列表失败:`, error);
      return [];
    }
  },
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
  },

  // 获取好友请求状态（检查是否已经发送过请求）
  getFriendRequestStatus: async (userId: number, friendId: number) => {
    try {
      const response = await api.get(`/friends/status?userId=${userId}&friendId=${friendId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      return { status: 'unknown' };
    } catch (error) {
      console.error('获取好友状态失败:', error);
      return { status: 'unknown' };
    }
  },
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
  },

  // 获取用户的最新对话列表
  getLatestConversations: async (userId: number) => {
    try {
      const response = await api.get(`/message/latest/${userId}`);
      //console.log('get latest conversations response', response);
      if (response.status === 200) {
        //console.log('get latest conversations data', response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('获取最新对话列表失败:', error);
      return [];
    }
  },
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

// 导出连接相关的API
export const connectionApi = {
  // Get random connections based on filters
  getConnections: async (
    page: number = 1,
    size: number = 6,
    userId: number,
    filters: Partial<{
      degree: string | null;
      university: string | null;
      city: string | null;
    }> = {}
  ) => {
    try {
      const queryParams = new URLSearchParams({
        current: page.toString(),
        size: size.toString(),
        userId: userId.toString(),
      });

      if (filters.degree) {
        queryParams.append('field', filters.degree);
      }
      if (filters.university) {
        queryParams.append('university', filters.university);
      }
      if (filters.city) {
        queryParams.append('city', filters.city);
      }

      const response = await api.get(`/user/randomPage?${queryParams}`);

      if (response.data.code === 200) {
        return response.data;
      }
      return {
        code: 404,
        message: 'No data found',
        data: {
          records: [],
          total: 0,
          size,
          current: page,
          pages: 0,
        },
      };
    } catch (error) {
      console.error('Failed to fetch connections:', error);
      return {
        code: 500,
        message: 'Error fetching connections',
        data: {
          records: [],
          total: 0,
          size,
          current: page,
          pages: 0,
        },
      };
    }
  },

  // Get user profile by ID
  getUserProfile: async (userId: number) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return {
        code: 500,
        message: 'Error fetching user profile',
        data: null,
      };
    }
  },

  // Send friend request
  sendFriendRequest: async (userId: number, friendId: number) => {
    try {
      const response = await api.post('/friends/request', {
        userId,
        friendId,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return {
        code: 500,
        message: 'Error sending friend request',
        data: null,
      };
    }
  },
};

export default api;
