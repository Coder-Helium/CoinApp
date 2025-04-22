import {makeAutoObservable} from 'mobx';
import type {Conversation, request, requestinfo, User} from '../services/mock/conversations';
import {wsService} from '../services/websocket';
import {messageApi, friendApi, connectionApi} from '../services/api';
import type {WebSocketMessage} from '../services/websocket/types';
import { cacheStores } from '../../metro.config';

class ConversationStore {
  conversations: Conversation[] = [];
  requestinfo: any[] = [];
  request: request[] = [
    {
      id: 1,
      name: 'David Liu',
      university: 'University of Queensland',
      department: 'Engineering',
      avatar: 'https://picsum.photos/id/1074/200',
    },
    {
      id: 2,
      name: 'James Wilson',
      university: 'Monash University',
      department: 'Medicine',
      avatar: 'https://picsum.photos/id/1012/200',
    },
  ];
  currentMessages: any = [];
  currentUserId: number | null = null;
  loading = false;
  sendingMessage = false;
  wsConnected = false;

  constructor() {
    makeAutoObservable(this);
    // 初始化WebSocket监听
    this.initWebSocketListeners();
  }

  // 初始化WebSocket监听
  private initWebSocketListeners() {
    // 监听消息事件
    wsService.on('message', this.handleWebSocketMessage);
    // 监听连接事件
    wsService.on('connected', () => {
      this.setWsConnected(true);
    });
    // 监听断开连接事件
    wsService.on('disconnected', () => {
      this.setWsConnected(false);
    });
  }

  // 处理WebSocket消息
  private handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.type === 'message' && message.data) {
      // 收到新消息
      this.handleNewMessage(message.data);
    } else if (message.type === 'connected' && message.userId && message.status) {
      // 用户状态变化
      this.handleUserStatusChange(message.userId, message.status);
    }
  };

  // 处理新消息
  private handleNewMessage(message: any) {
    // 如果是当前对话，添加到当前消息列表
    if (this.currentUserId === message.senderId) {
      this.currentMessages.push(message);
    }

    // 更新对话列表中的最后一条消息
    const conversation = this.conversations.find(
      c => c.userId === message.senderId,
    );
    if (conversation) {
      conversation.lastMessage = message.text;
      conversation.lastMessageTime = message.timestamp;
      // 如果不是当前对话，增加未读数
      if (this.currentUserId !== message.senderId) {
        conversation.unreadCount += 1;
      }
    }
  }

  // 处理用户状态变化
  private handleUserStatusChange(userId: number, status: 'online' | 'offline') {
    // 可以在UI中显示用户在线状态
    console.log(`用户 ${userId} 状态变更为: ${status}`);
    // 实际项目中可能需要更新用户状态
  }

  // 连接WebSocket
  async connectWebSocket(url: string = 'ws://54.252.49.201:8080') {
    try {
      const connected = await wsService.connect(url);
      this.setWsConnected(connected);
      return connected;
    } catch (error) {
      console.error('WebSocket连接失败', error);
      this.setWsConnected(false);
      return false;
    }
  }

  // 断开WebSocket连接
  disconnectWebSocket() {
    wsService.disconnect();
    this.setWsConnected(false);
  }

  // 设置WebSocket连接状态
  setWsConnected(connected: boolean) {
    this.wsConnected = connected;
  }

  async fetchConversations(userId: any) {
    this.loading = true;
    try {
      const data = await messageApi.getLatestConversations(userId);
      console.log('get conversations data', data);
      this.conversations = data;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async addFriend(userId: number, friendId: number) {
    this.loading = true;  
    try{
      const data = await friendApi.sendFriendRequest(userId, friendId);
      return data;
    } 
    catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async fetchRequest(userId: any) {
    this.loading = true;
    try {
      // Fetch friend requests
      const friendRequests = await friendApi.getFriendRequests(userId);
      console.log('Friend requests:', friendRequests);

      if (!friendRequests || friendRequests.length === 0) {
        //console.error('No friend requests found');
        return;
      }
      else{
        this.requestinfo = friendRequests

        const requestsWithDetails = await Promise.all(
          this.requestinfo.map(async (info) => {
            const userDetails = await connectionApi.getUserProfile(info.friendId);
            return {
              id: info.friendId,
              name: userDetails?.name || 'Unknown',
              university: userDetails?.userUni || 'Unknown University',
              department: userDetails?.userField || 'Unknown Department',
              avatar: userDetails?.userIcon || 'https://picsum.photos/200', // Default avatar
            };
          })
        );

        this.request = requestsWithDetails;
      }

      // Update the request array with detailed information
      
      console.log('Updated request array:', this.request);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      this.loading = false;
    }
  }

  async acceptFriendRequest(userId: number, friendId: number) {
    this.request = this.request.filter(req => req.id !== friendId);
    try {
      const success = await friendApi.processFriendRequest(userId, friendId, 'accept');
      if (success) {
        console.log(`Friend request from ${friendId} accepted.`);
        // Remove the accepted request from the list
        
      }
      return success;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }
  
  }

  async rejectFriendRequest(userId: number, friendId: number) {
    this.request = this.request.filter(req => req.id !== friendId);
    try {
      const success = await friendApi.processFriendRequest(userId, friendId, 'reject');
      if (success) {
        console.log(`Friend request from ${friendId} rejected.`);
        // Remove the rejected request from the list
      
      }
      return success;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      return false;
    }
  }

  async fetchMessages(userId: number, contactId: number) {
    this.loading = true;
    this.currentUserId = userId;
    try {
      const data = await messageApi.getMessagesBetweenUsers(userId, contactId);
      this.currentMessages = data;
      // 标记消息为已读
      await messageApi.markAsRead(userId);
      // 更新对话列表中的未读数
      const conversation = this.conversations.find(c => c.userId === userId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async sendMessage(text: string) {
    if (!this.currentUserId || !text.trim()) {
      return;
    }

    this.sendingMessage = true;
    try {
      const newMessage = await messageApi.sendMessage(
        this.currentUserId,
        text,
      );
      this.currentMessages.push(newMessage);

      // 更新对话列表中的最后一条消息
      const conversation = this.conversations.find(
        c => c.userId === this.currentUserId,
      );
      if (conversation) {
        conversation.lastMessage = text;
        conversation.lastMessageTime = '刚刚';
      }

      // 如果WebSocket已连接，通过WebSocket发送消息
      if (this.wsConnected) {
        wsService.sendMessage({
          type: 'message',
          data: newMessage,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.sendingMessage = false;
    }
  }

  getTotalUnreadCount(): number {
    return this.conversations.reduce(
      (total, conversation) => total + conversation.unreadCount,
      0,
    );
  }
}

const conversationStore = new ConversationStore();

export const useConversationStore = () => conversationStore;
