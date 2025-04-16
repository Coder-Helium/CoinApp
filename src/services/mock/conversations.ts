export type User = {
  id: number;
  name: string;
  avatar: string;
  lastSeen: string;
};

export type Message = {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
  isRead: boolean;
};

export type Conversation = {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Kim',
    avatar: 'https://picsum.photos/id/1027/200',
    lastSeen: 'yesterday',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://picsum.photos/id/1025/200',
    lastSeen: 'yesterday',
  },
  {
    id: 3,
    name: 'Emma Wang',
    avatar: 'https://picsum.photos/id/1062/200',
    lastSeen: 'yesterday',
  },
  {
    id: 4,
    name: 'David Liu',
    avatar: 'https://picsum.photos/id/1074/200',
    lastSeen: 'yesterday',
  },
];

// 模拟对话数据
export const mockConversations: Conversation[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Sarah Kim',
    userAvatar: 'https://picsum.photos/id/1027/200',
    lastMessage: 'I am fine, thank you!',
    lastMessageTime: '10:30',
    unreadCount: 0,
  },
  {
    id: 2,
    userId: 2,
    userName: 'Michael Chen',
    userAvatar: 'https://picsum.photos/id/1025/200',
    lastMessage: 'can u help me?',
    lastMessageTime: 'yesterday',
    unreadCount: 2,
  },
  {
    id: 3,
    userId: 3,
    userName: 'Emma Wang',
    userAvatar: 'https://picsum.photos/id/1062/200',
    lastMessage: 'I am fine, thank you!',
    lastMessageTime: 'yesterday',
    unreadCount: 0,
  },
  {
    id: 4,
    userId: 4,
    userName: 'David Liu',
    userAvatar: 'https://picsum.photos/id/1074/200',
    lastMessage: 'when is the activity starting?',
    lastMessageTime: 'yesterday',
    unreadCount: 1,
  },
];

// 模拟消息数据
export const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderId: 1,
      receiverId: 0, // 0 表示当前用户
      text: 'hello, how are you?',
      timestamp: 'yesterdayterday 14:20',
      isRead: true,
    },
    {
      id: 2,
      senderId: 0,
      receiverId: 1,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 14:25',
      isRead: true,
    },
    {
      id: 3,
      senderId: 1,
      receiverId: 0,
      text: 'I have been to the activity before, the atmosphere is good, and I can meet many friends from different countries.',
      timestamp: 'yesterdayterday 14:30',
      isRead: true,
    },
    {
      id: 4,
      senderId: 0,
      receiverId: 1,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 14:35',
      isRead: true,
    },
    {
      id: 5,
      senderId: 1,
      receiverId: 0,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 14:40',
      isRead: true,
    },
    {
      id: 6,
      senderId: 0,
      receiverId: 1,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 15:00',
      isRead: true,
    },
    {
      id: 7,
      senderId: 1,
      receiverId: 0,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 15:10',
      isRead: true,
    },
    {
      id: 8,
      senderId: 0,
      receiverId: 1,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 15:15',
      isRead: true,
    },
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      receiverId: 0,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 09:20',
      isRead: true,
    },
    {
      id: 2,
      senderId: 0,
      receiverId: 2,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 09:30',
      isRead: true,
    },
    {
      id: 3,
      senderId: 2,
      receiverId: 0,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 09:35',
      isRead: true,
    },
    {
      id: 4,
      senderId: 2,
      receiverId: 0,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 09:40',
      isRead: false,
    },
    {
      id: 5,
      senderId: 2,
      receiverId: 0,
      text: 'I am fine, thank you!',
      timestamp: 'yesterdayterday 09:41',
      isRead: false,
    },
  ],
};

// 模拟API服务
export const conversationApi = {
  // 获取所有对话
  getConversations: async (): Promise<Conversation[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockConversations;
  },

  // 获取与特定用户的消息
  getMessages: async (userId: number): Promise<Message[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMessages[userId] || [];
  },

  // 发送消息
  sendMessage: async (
    receiverId: number,
    text: string,
  ): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newMessage: Message = {
      id: Math.floor(Math.random() * 1000000),
      senderId: 0, // 当前用户
      receiverId,
      text,
      timestamp: '刚刚',
      isRead: false,
    };

    // 添加到模拟数据中
    if (!mockMessages[receiverId]) {
      mockMessages[receiverId] = [];
    }
    mockMessages[receiverId].push(newMessage);

    // 更新对话列表中的最后一条消息
    const conversation = mockConversations.find(c => c.userId === receiverId);
    if (conversation) {
      conversation.lastMessage = text;
      conversation.lastMessageTime = '刚刚';
    }

    return newMessage;
  },

  // 标记消息为已读
  markAsRead: async (userId: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const messages = mockMessages[userId];
    if (messages) {
      messages.forEach(message => {
        if (message.senderId === userId) {
          message.isRead = true;
        }
      });

      // 更新对话列表中的未读数
      const conversation = mockConversations.find(c => c.userId === userId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
      return true;
    }
    return false;
  },
}; 