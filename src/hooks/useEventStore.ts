import {makeAutoObservable} from 'mobx';
import {eventApi} from '../services/mock/events';
import type {Event} from '../services/mock/events';

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
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async fetchEventById(id: number) {
    this.loading = true;
    try {
      const data = await eventApi.getEventById(id);
      this.currentEvent = data || null;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async registerEvent(id: number) {
    try {
      const success = await eventApi.registerEvent(id);
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
      console.error(error);
      return false;
    }
  }

  async unregisterEvent(id: number) {
    try {
      const success = await eventApi.unregisterEvent(id);
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
      console.error(error);
      return false;
    }
  }
}

const eventStore = new EventStore();

export const useEventStore = () => eventStore; 