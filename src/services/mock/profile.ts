export type UserProfile = {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  country: string;
  city: string;
  university: string;
  fieldOfStudy: string;
  languages: string[];
  followers: number;
  following: number;
};

export type UserListItem = {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  isFollowing: boolean;
};

// 模拟用户资料数据
export const mockUserProfile: UserProfile = {
  id: 0,
  name: 'John Doe',
  avatar: 'https://picsum.photos/id/1005/200',
  bio: '悉尼大学计算机科学专业学生，热爱编程和旅行。',
  country: '澳大利亚',
  city: '悉尼',
  university: '悉尼大学',
  fieldOfStudy: '计算机科学',
  languages: ['英语', '中文'],
  followers: 128,
  following: 97,
};

// 模拟粉丝列表
export const mockFollowers: UserListItem[] = [
  {
    id: 1,
    name: 'Sarah Kim',
    avatar: 'https://picsum.photos/id/1027/200',
    bio: '语言学学生，喜欢探索不同文化。',
    isFollowing: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://picsum.photos/id/1025/200',
    bio: '商科学生，对国际贸易感兴趣。',
    isFollowing: false,
  },
  {
    id: 3,
    name: 'Emma Wang',
    avatar: 'https://picsum.photos/id/1062/200',
    bio: '艺术设计专业，热爱创意和摄影。',
    isFollowing: true,
  },
  {
    id: 4,
    name: 'David Liu',
    avatar: 'https://picsum.photos/id/1074/200',
    bio: '工程学专业，喜欢解决问题和创新。',
    isFollowing: false,
  },
];

// 模拟关注列表
export const mockFollowing: UserListItem[] = [
  {
    id: 1,
    name: 'Sarah Kim',
    avatar: 'https://picsum.photos/id/1027/200',
    bio: '语言学学生，喜欢探索不同文化。',
    isFollowing: true,
  },
  {
    id: 3,
    name: 'Emma Wang',
    avatar: 'https://picsum.photos/id/1062/200',
    bio: '艺术设计专业，热爱创意和摄影。',
    isFollowing: true,
  },
  {
    id: 5,
    name: 'James Wilson',
    avatar: 'https://picsum.photos/id/1012/200',
    bio: '医学专业学生，热爱健康和运动。',
    isFollowing: true,
  },
];

// 模拟API服务
export const profileApi = {
  // 获取用户资料
  getUserProfile: async (): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUserProfile;
  },

  // 获取粉丝列表
  getFollowers: async (): Promise<UserListItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFollowers;
  },

  // 获取关注列表
  getFollowing: async (): Promise<UserListItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFollowing;
  },

  // 关注用户
  followUser: async (userId: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = [...mockFollowers, ...mockFollowing].find(
      u => u.id === userId,
    );
    if (user) {
      user.isFollowing = true;
      mockUserProfile.following += 1;
      return true;
    }
    return false;
  },

  // 取消关注用户
  unfollowUser: async (userId: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = [...mockFollowers, ...mockFollowing].find(
      u => u.id === userId,
    );
    if (user && user.isFollowing) {
      user.isFollowing = false;
      mockUserProfile.following -= 1;
      return true;
    }
    return false;
  },

  // 更新用户资料
  updateProfile: async (profile: Partial<UserProfile>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    Object.assign(mockUserProfile, profile);
    return true;
  },
}; 