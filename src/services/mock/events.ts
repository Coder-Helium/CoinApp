export type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  attendees: number;
  isRegistered: boolean;
};

// 模拟活动数据
export const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Sydney Language Exchange',
    date: '27 Mar 2023',
    time: '18:00',
    location: 'Sydney CBD',
    image: 'https://picsum.photos/400/200',
    description: '加入我们的语言交流活动，结交来自世界各地的朋友，提高您的语言技能。活动将在悉尼市中心举行，提供小吃和饮料。',
    attendees: 45,
    isRegistered: false,
  },
  {
    id: 2,
    title: 'International Student Mixer',
    date: '30 Mar 2023',
    time: '19:00',
    location: 'Sydney University',
    image: 'https://picsum.photos/400/201',
    description: '为国际学生举办的社交活动，认识来自不同国家和文化背景的同学。活动将在悉尼大学举行，提供食物和饮料。',
    attendees: 32,
    isRegistered: true,
  },
  {
    id: 3,
    title: 'Cultural Food Festival',
    date: '5 Apr 2023',
    time: '12:00',
    location: 'Darling Harbour',
    image: 'https://picsum.photos/400/202',
    description: '品尝来自世界各地的美食，体验不同的文化和传统。活动将在达令港举行，有现场音乐表演和文化展示。',
    attendees: 78,
    isRegistered: false,
  },
  {
    id: 4,
    title: 'Career Networking Event',
    date: '10 Apr 2023',
    time: '17:30',
    location: 'NSW Business Chamber',
    image: 'https://picsum.photos/400/203',
    description: '为国际学生和毕业生提供的职业发展和人脉拓展活动。与行业专业人士交流，了解就业机会和职业发展路径。',
    attendees: 50,
    isRegistered: false,
  },
];

// 模拟API服务
export const eventApi = {
  // 获取所有活动
  getEvents: async (): Promise<Event[]> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents;
  },

  // 获取单个活动详情
  getEventById: async (id: number): Promise<Event | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEvents.find(event => event.id === id);
  },

  // 注册活动
  registerEvent: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = mockEvents.find(e => e.id === id);
    if (event) {
      event.isRegistered = true;
      event.attendees += 1;
      return true;
    }
    return false;
  },

  // 取消注册活动
  unregisterEvent: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = mockEvents.find(e => e.id === id);
    if (event && event.isRegistered) {
      event.isRegistered = false;
      event.attendees -= 1;
      return true;
    }
    return false;
  },
}; 