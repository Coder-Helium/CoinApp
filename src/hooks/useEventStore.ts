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

  constructor() {
    makeAutoObservable(this);
  }

  async fetchEvents() {
    this.loading = true;
    try {
      const data = await eventApi.getEvents();
      this.events = data;
    } catch (error) {
      console.error('fetch events failed:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchEventById(id: number) {
    this.loading = true;
    try {
      const data = await eventApi.getEventById(id);
      this.currentEvent = data;
    } catch (error) {
      console.error(`获取事件${id}详情失败:`, error);
      console.error(`Failed to fetch event ${id} details:`, error);
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
      console.error(`Failed to register event ${id}:`, error);
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
      console.error(`Failed to unregister event ${id}:`, error);
      return false;
    }
  }
}

const eventStore = new EventStore();

export const useEventStore = () => eventStore;
