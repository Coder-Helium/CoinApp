import {makeAutoObservable} from 'mobx';
import {conversationApi} from '../services/mock/conversations';
import type {Conversation, Message} from '../services/mock/conversations';

class ConversationStore {
  conversations: Conversation[] = [];
  currentMessages: Message[] = [];
  currentUserId: number | null = null;
  loading = false;
  sendingMessage = false;

  constructor() {
    makeAutoObservable(this);
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
    if (!this.currentUserId || !text.trim()) return;

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