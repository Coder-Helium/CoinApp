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
  externalLink?: string;
};

// 完整的API响应类型
// Complete API response type
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

// 定义参与者类型
export type Attendee = {
  id: number;
  name: string;
  avatar: string;
  userField: string;
  userUni: string;
  isAdded: boolean;
};

// Mock event data
export const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Sydney Language Exchange',
    date: '2023-03-27T18:00:00',
    time: '18:00',
    location: 'Sydney CBD',
    image: 'https://picsum.photos/400/200',
    description: 'Join our language exchange event to make friends from around the world and improve your language skills. The event will be held in Sydney CBD with snacks and drinks provided.',
    attendees: 45,
    isRegistered: false,
    externalLink: 'https://example.com/events/1',
  },
  {
    id: 2,
    title: 'International Student Mixer',
    date: '2023-03-30T19:00:00',
    time: '19:00',
    location: 'Sydney University',
    image: 'https://picsum.photos/400/201',
    description: 'A social event for international students to meet classmates from different countries and cultural backgrounds. The event will be held at Sydney University with food and drinks provided.',
    attendees: 32,
    isRegistered: true,
    externalLink: 'https://example.com/events/2',
  },
  {
    id: 3,
    title: 'Cultural Food Festival',
    date: '2023-04-05T12:00:00',
    time: '12:00',
    location: 'Darling Harbour',
    image: 'https://picsum.photos/400/202',
    description: 'Taste cuisines from around the world and experience different cultures and traditions. The event will be held at Darling Harbour with live music performances and cultural exhibitions.',
    attendees: 78,
    isRegistered: false,
    externalLink: 'https://example.com/events/3',
  },
  {
    id: 4,
    title: 'Career Networking Event',
    date: '2023-04-10T17:30:00',
    time: '17:30',
    location: 'NSW Business Chamber',
    image: 'https://picsum.photos/400/203',
    description: 'Career development and networking event for international students and graduates. Connect with industry professionals and learn about job opportunities and career paths.',
    attendees: 50,
    isRegistered: false,
    externalLink: 'https://example.com/events/4',
  },
];

// Pagination data type
export type PageData<T> = {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
};

// 模拟API服务
// Mock API service
export const mockEventApi = {
  // 获取所有活动
  // Get all events
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    // 模拟API请求延迟
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      code: 200,
      message: 'Event list retrieved successfully',
      data: mockEvents,
    };
  },

  // Get event list with pagination
  getEventsPage: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageData<Event>>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const total = mockEvents.length;
    const pages = Math.ceil(total / size);
    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, total);
    const records = mockEvents.slice(startIndex, endIndex);

    return {
      code: 200,
      message: 'Paged event list retrieved successfully',
      data: {
        records,
        total,
        size,
        current: page,
        pages,
      },
    };
  },

  // 获取单个活动详情
  // Get single event details
  getEventById: async (id: number): Promise<ApiResponse<Event | null>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = mockEvents.find(event => event.id === id);

    if (event) {
      return {
        code: 200,
        message: 'Event details retrieved successfully',
        data: event,
      };
    }

    return {
      code: 404,
      message: 'Event not found',
      data: null,
    };
  },

  // register event
  registerEvent: async (id: number): Promise<ApiResponse<boolean>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = mockEvents.find(e => e.id === id);

    if (event) {
      event.isRegistered = true;
      event.attendees += 1;
      return {
        code: 200,
        message: 'Event registration successful',
        data: true,
      };
    }

    return {
      code: 404,
      message: 'Event not found',
      data: false,
    };
  },

  // Unregister from event
  unregisterEvent: async (id: number): Promise<ApiResponse<boolean>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = mockEvents.find(e => e.id === id);

    if (event && event.isRegistered) {
      event.isRegistered = false;
      event.attendees -= 1;
      return {
        code: 200,
        message: 'Event unregistration successful',
        data: true,
      };
    }

    if (!event) {
      return {
        code: 404,
        message: 'Event not found',
        data: false,
      };
    }

    return {
      code: 400,
      message: 'You have not registered for this event',
      data: false,
    };
  },

  // get event attendees list
  getEventAttendees: async (eventId: number): Promise<ApiResponse<Attendee[]>> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // find event
    const event = mockEvents.find(e => e.id === eventId);

    if (!event) {
      return {
        code: 404,
        message: 'Event not found',
        data: [],
      };
    }

    // generate random attendees data
    const attendees: Attendee[] = Array.from({length: event.attendees}, (_, i) => ({
      id: i + 1,
      name: `Attendee ${i + 1}`,
      avatar: `https://picsum.photos/id/${(i + 100) % 1000}/200`,
      userField: ['计算机科学', '商业管理', '工程学', '艺术设计', '医学', '法律'][Math.floor(Math.random() * 6)],
      userUni: ['悉尼大学', '新南威尔士大学', '墨尔本大学', '昆士兰大学', '莫纳什大学'][Math.floor(Math.random() * 5)],
      isAdded: Math.random() > 0.7, // 随机确定是否已添加为好友
    }));

    return {
      code: 200,
      message: 'Event attendees retrieved successfully',
      data: attendees,
    };
  },
};
