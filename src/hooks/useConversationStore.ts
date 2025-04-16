import {makeAutoObservable} from 'mobx';
import {conversationApi} from '../services/mock/conversations';
import type {Conversation, Message} from '../services/mock/conversations';
import {wsService} from '../services/websocket';
import type {WebSocketMessage} from '../services/websocket/types';

class ConversationStore {
  conversations: Conversation[] = [];
  currentMessages: Message[] = [];
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
  private handleNewMessage(message: Message) {
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

  async fetchConversations() {
    this.loading = true;
    try {
      const data = await conversationApi.getConversations();
      this.conversations = data;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async fetchMessages(userId: number) {
    this.loading = true;
    this.currentUserId = userId;
    try {
      const data = await conversationApi.getMessages(userId);
      this.currentMessages = data;
      // 标记消息为已读
      await conversationApi.markAsRead(userId);
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
      const newMessage = await conversationApi.sendMessage(
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
