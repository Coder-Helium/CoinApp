import EventEmitter from './EventEmitter';
import {WebSocketMessage} from './types';

class WebSocketService extends EventEmitter {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL = 3000;
  private url: string = '';
  private useMockBridge = false;

  constructor() {
    super();
  }

  // 连接WebSocket服务器
  connect(url: string): Promise<boolean> {
    this.url = url;

    // 检查是否使用模拟模式
    if (url.includes('ws://mock')) {
      this.useMockBridge = true;
      
      // 在这里我们假装使用了真实的WebSocket
      // 但实际上是在使用模拟服务器
      // 因为我们实现了桥接层，所以修改了该方法的内部实现
      // 但保持了原有的API调用方式
      console.log('使用模拟WebSocket服务器');
      this.isConnected = true;
      setTimeout(() => {
        this.emit('connected', { type: 'connected' });
      }, 100) as unknown as number;
      return Promise.resolve(true);
    }

    // 以下是真实的WebSocket连接逻辑
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
          console.log('WebSocket连接成功');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected', { type: 'connected' });
          resolve(true);
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            this.emit('message', message);
          } catch (e) {
            console.error('解析WebSocket消息失败', e);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket错误', error);
          this.emit('error', error);
          reject(error);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket连接已关闭');
          this.isConnected = false;
          this.emit('disconnected', { type: 'disconnected' });
          this.attemptReconnect();
        };
      } catch (error) {
        console.error('创建WebSocket连接失败', error);
        reject(error);
      }
    });
  }

  // 尝试重新连接
  private attemptReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectTimer = setTimeout(() => {
        console.log(`尝试重新连接 WebSocket (${this.reconnectAttempts + 1}/${this.MAX_RECONNECT_ATTEMPTS})`);
        this.reconnectAttempts++;
        this.connect(this.url).catch(() => {});
      }, this.RECONNECT_INTERVAL) as unknown as number;
    } else {
      console.log('达到最大重连次数，停止重连');
      this.emit('reconnect_failed');
    }
  }

  // 发送消息
  sendMessage(message: WebSocketMessage): boolean {
    if (!this.isConnected) {
      return false;
    }

    if (this.useMockBridge) {
      // 在模拟模式下，直接发出消息事件
      // 桥接层会处理转发
      this.emit('message', message);
      return true;
    }
    
    // 真实WebSocket发送逻辑
    if (this.socket) {
      try {
        this.socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('发送WebSocket消息失败', error);
        return false;
      }
    }
    return false;
  }

  // 断开连接
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.useMockBridge) {
      this.isConnected = false;
      this.emit('disconnected', { type: 'disconnected' });
      return;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 检查连接状态
  isConnectedToServer(): boolean {
    return this.isConnected;
  }
}

// 创建单例
export const wsService = new WebSocketService();

// 不再从这里导出bridge，防止循环依赖
// export * from './bridge'; 