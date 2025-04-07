import {makeAutoObservable} from 'mobx';
import {messageApi} from '../services/api';
import {webSocketService} from '../services/websocket';
import type {Conversation, Message} from '../services/mock/conversations';

class ConversationStore {
  conversations: Conversation[] = [];
  currentMessages: Message[] = [];
  currentUserId: number | null = null;
  loading = false;
  sendingMessage = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    webSocketService.connect();
    webSocketService.setMessageHandler((data) => {
      if (data.type === 'message') {
        this.handleNewMessage(data.message);
      }
    });
  }

  private handleNewMessage(message: Message) {
    // If message belongs to current conversation, add it
    if (message.senderId === this.currentUserId) {
      this.currentMessages.push(message);
    }

    // Update conversation list
    const conversation = this.conversations.find(
      c => c.userId === message.senderId
    );
    if (conversation) {
      conversation.lastMessage = message.text;
      conversation.lastMessageTime = '刚刚';
      conversation.unreadCount += 1;
    }
  }

  async fetchConversations() {
    this.loading = true;
    try {
      const response = await messageApi.getMessagesBetweenUsers(0, 0); // Need to implement proper API
      if (response.code === 200) {
        this.conversations = response.data;
      }
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
      const response = await messageApi.getMessagesBetweenUsers(userId, 0); // Assuming 0 is current user
      if (response.code === 200) {
        this.currentMessages = response.data;
        // Update unread count
        const conversation = this.conversations.find(c => c.userId === userId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async sendMessage(text: string) {
    if (!this.currentUserId || !text.trim()) return;

    this.sendingMessage = true;
    try {
      const response = await messageApi.sendMessage(
        0, // Current user ID
        this.currentUserId,
        text
      );

      if (response.code === 200) {
        const newMessage = response.data;
        this.currentMessages.push(newMessage);

        // Update conversation
        const conversation = this.conversations.find(
          c => c.userId === this.currentUserId
        );
        if (conversation) {
          conversation.lastMessage = text;
          conversation.lastMessageTime = '刚刚';
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.sendingMessage = false;
    }
  }

  cleanup() {
    webSocketService.disconnect();
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
