/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'https://api.example.com', // 这里使用模拟的 API 地址
});

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

// API 方法
export const postApi = {
  // 获取帖子列表
  getPosts: async () => {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPosts;
  },

  // 获取单个帖子详情
  getPostById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPosts.find(post => post.id === id);
  },
};
