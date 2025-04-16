import { mockMessages, mockUsers } from '../mock/conversations';
import type { Message } from '../mock/conversations';
import type { WebSocketMessage } from './types';

class MockWebSocketServer {
  private callbacks: Map<string, (data: WebSocketMessage) => void> = new Map();
  private isConnected: boolean = false;
  private currentUserId: number | null = null;
  
  // 模拟连接
  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.executeCallback('connected', {
          type: 'connected',
        });
        resolve(true);
      }, 500) as unknown as number; // 模拟连接延迟
    });
  }

  // 模拟断开连接
  disconnect(): void {
    if (this.isConnected) {
      this.isConnected = false;
      this.executeCallback('disconnected', {
        type: 'disconnected',
      });
    }
  }

  // 设置回调
  on(event: string, callback: (data: WebSocketMessage) => void): void {
    if (!event || !callback) {
      console.error('无效的事件或回调函数');
      return;
    }
    this.callbacks.set(event, callback);
  }

  // 移除回调
  off(event: string): void {
    if (!event) {
      console.error('无效的事件名称');
      return;
    }
    this.callbacks.delete(event);
  }

  // 执行回调
  private executeCallback(event: string, data: WebSocketMessage): void {
    const callback = this.callbacks.get(event);
    if (callback) {
      callback(data);
    }
  }

  // 模拟发送消息
  sendMessage(message: WebSocketMessage): boolean {
    if (!this.isConnected) {
      return false;
    }

    setTimeout(() => {
      if (message.type === 'message' && message.data) {
        // 保存消息
        this.saveMessage(message.data);
        
        // 模拟接收回复
        setTimeout(() => {
          this.simulateReply(message.data?.receiverId);
        }, 1000 + Math.random() * 2000) as unknown as number; // 随机1-3秒后回复
      }
    }, 100) as unknown as number;

    return true;
  }

  // 保存消息到模拟数据
  private saveMessage(message: Message): void {
    if (!message) return;
    
    const receiverId = message.receiverId;
    if (!mockMessages[receiverId]) {
      mockMessages[receiverId] = [];
    }
    mockMessages[receiverId].push(message);
  }

  // 模拟收到回复
  simulateReply(userId: number | undefined): void {
    if (!userId || !this.isConnected) return;
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;
    
    // 创建模拟回复消息
    const replies = [
      '好的，我明白了！',
      '谢谢你的消息。',
      '这听起来不错！',
      '我稍后会回复你更详细的信息。',
      '我现在有点忙，稍后联系你可以吗？',
      '很高兴收到你的消息！',
      '我们可以明天再详细讨论这个问题吗？',
      '我想了解更多关于这个的信息。',
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMessage: Message = {
      id: Math.floor(Math.random() * 1000000),
      senderId: userId,
      receiverId: 0, // 当前用户
      text: randomReply,
      timestamp: '刚刚',
      isRead: false,
    };
    
    // 保存消息
    this.saveMessage(replyMessage);
    
    // 触发消息事件
    this.executeCallback('message', {
      type: 'message',
      data: replyMessage,
      userId: userId,
    });
  }

  // 设置当前用户ID
  setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
  }

  // 模拟用户上线/下线状态变化
  simulateUserStatusChange(): void {
    if (!this.isConnected) return;
    
    // 随机选择一个用户
    const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
    const randomUser = mockUsers[randomUserIndex];
    
    // 随机设置在线状态
    const status = Math.random() > 0.5 ? 'online' : 'offline';
    
    this.executeCallback('message', {
      type: 'connected',
      userId: randomUser.id,
      status: status,
    });
  }
}

export const mockWebSocketServer = new MockWebSocketServer(); 