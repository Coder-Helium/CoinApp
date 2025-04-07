import AsyncStorage from '@react-native-async-storage/async-storage';

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandler: ((data: any) => void) | null = null;
  private readonly baseUrl: string = 'ws://172.20.10.5:8080/ws';

  async connect() {
    try {
      const token = await AsyncStorage.getItem('token');
      this.ws = new WebSocket(`${this.baseUrl}?token=${token}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (this.messageHandler) {
          this.messageHandler(data);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  private reconnect() {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, 3000);
  }

  setMessageHandler(handler: (data: any) => void) {
    this.messageHandler = handler;
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.messageHandler = null;
  }
}

export const webSocketService = new WebSocketService();