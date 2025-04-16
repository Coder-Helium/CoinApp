import {Message} from '../mock/conversations';

export interface WebSocketMessage {
  type: 'message' | 'connected' | 'disconnected';
  data?: Message;
  userId?: number;
  status?: 'online' | 'offline';
} 