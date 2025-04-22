export type Post = {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  caption: string;
  comments: number;
  isLiked: boolean;
};

export type Message = {
  msgId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  read: boolean;
};

export type Conversation = {
  contactAvatar: string;
  contactId: number;
  contactName: string;
  lastMessage: any;
  lastMessageTime: string;
};
