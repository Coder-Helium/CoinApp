import {makeAutoObservable} from 'mobx';
import {eventApi} from '../services/api';

export interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  image?: string;
  location?: string;
  time?: string;
  attendees: number;
  isRegistered: boolean;
  externalLink?: string;
  status?: string;
}

class EventStore {
  events: Event[] = [];
  currentEvent: Event | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchEvents() {
    if (this.loading) return; // 防止重复请求

    this.loading = true;
    this.error = null;
    try {
      const data = await eventApi.getEvents();
      this.events = data;
      console.log('成功获取事件列表，数量:', data.length);
    } catch (error) {
      console.error('获取事件列表失败:', error);
      this.error = '获取事件列表失败';
      this.events = []; // 确保在出错时重置数组
    } finally {
      this.loading = false;
    }
  }

  async fetchEventById(id: number) {
    if (this.loading) return; // 防止重复请求
    
    this.loading = true;
    this.error = null;
    
    try {
      const data = await eventApi.getEventById(id);
      this.currentEvent = data as Event;
    } catch (error) {
      console.error(`获取事件${id}详情失败:`, error);
      this.error = `获取事件${id}详情失败`;
      this.currentEvent = null;
    } finally {
      this.loading = false;
    }
  }

  async registerEvent(id: number, userId: number) {
    try {
      const success = await eventApi.registerEvent(id, userId);
      if (success) {
        const event = this.events.find(e => e.id === id);
        if (event) {
          event.isRegistered = true;
          event.attendees += 1;
        }
        if (this.currentEvent?.id === id) {
          this.currentEvent.isRegistered = true;
          this.currentEvent.attendees += 1;
        }
      }
      return success;
    } catch (error) {
      console.error(`注册事件${id}失败:`, error);
      return false;
    }
  }

  async unregisterEvent(id: number, userId: number) {
    try {
      const success = await eventApi.unregisterEvent(id, userId);
      if (success) {
        const event = this.events.find(e => e.id === id);
        if (event) {
          event.isRegistered = false;
          event.attendees -= 1;
        }
        if (this.currentEvent?.id === id) {
          this.currentEvent.isRegistered = false;
          this.currentEvent.attendees -= 1;
        }
      }
      return success;
    } catch (error) {
      console.error(`取消注册事件${id}失败:`, error);
      return false;
    }
  }
  
  // 添加清除错误的方法
  clearError() {
    this.error = null;
  }
}

const eventStore = new EventStore();

export const useEventStore = () => eventStore;
