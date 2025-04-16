import type {WebSocketMessage} from './types';

// 声明类型而不是直接导入，避免循环依赖
interface IWebSocketService {
  on(event: string, listener: (data: any) => void): any;
  off(event: string, listener?: (data: any) => void): any;
  emit(event: string, ...args: any[]): boolean;
}

interface IMockWebSocketServer {
  on(event: string, callback: (data: WebSocketMessage) => void): void;
  off(event: string): void;
  connect(): Promise<boolean>;
  disconnect(): void;
  sendMessage(message: WebSocketMessage): boolean;
  simulateReply(userId: number | undefined): void;
  simulateUserStatusChange(): void;
  setCurrentUserId(userId: number): void;
}

/**
 * WebSocket桥接器 - 用于连接真实WebSocket和模拟WebSocket
 * 当URL包含'ws://mock'时，使用模拟WebSocket
 * 否则使用真实WebSocket
 */
class WebSocketBridge {
  private isMockMode = false;
  private wsService: IWebSocketService | null = null;
  private mockServer: IMockWebSocketServer | null = null;
  private isInitialized = false;

  constructor() {
    // 延迟初始化，确保所有依赖都已加载
    setTimeout(this.initialize.bind(this), 0);
  }

  // 延迟初始化
  private initialize() {
    if (this.isInitialized) return;

    try {
      // 动态导入，避免循环依赖
      const { wsService } = require('./index');
      const { mockWebSocketServer } = require('./mockServer');
      
      this.wsService = wsService;
      this.mockServer = mockWebSocketServer;
      this.isInitialized = true;
      
      console.log('WebSocketBridge 初始化成功');
      this.setupListeners();
    } catch (error) {
      console.error('WebSocketBridge 初始化失败:', error);
    }
  }

  private setupListeners() {
    if (!this.wsService || !this.mockServer) {
      console.error('WebSocketBridge 组件未完全初始化，无法设置监听器');
      return;
    }

    // 从模拟服务器转发事件到wsService
    this.mockServer.on('connected', (data: WebSocketMessage) => {
      this.wsService?.emit('connected', data);
    });

    this.mockServer.on('disconnected', (data: WebSocketMessage) => {
      this.wsService?.emit('disconnected', data);
    });

    this.mockServer.on('message', (data: WebSocketMessage) => {
      this.wsService?.emit('message', data);
    });

    // 从wsService转发事件到模拟服务器
    this.wsService.on('message', (data: WebSocketMessage) => {
      if (this.isMockMode && this.mockServer) {
        this.mockServer.sendMessage(data);
      }
    });
  }

  /**
   * 连接WebSocket
   * @param url WebSocket服务器URL
   * @returns 连接是否成功
   */
  async connect(url: string): Promise<boolean> {
    // 确保已初始化
    if (!this.isInitialized) {
      this.initialize();
      // 等待初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!this.mockServer) {
      console.error('WebSocketBridge 未完全初始化，无法连接');
      return false;
    }

    if (url.includes('ws://mock')) {
      this.isMockMode = true;
      // 使用模拟WebSocket服务器
      return this.mockServer.connect();
    } else {
      this.isMockMode = false;
      // 使用真实WebSocket
      return true; // 在这里我们不实际连接，而是返回成功
    }
  }

  /**
   * 断开WebSocket连接
   */
  disconnect() {
    if (!this.mockServer) return;

    if (this.isMockMode) {
      this.mockServer.disconnect();
    } else {
      // 断开真实连接的代码
    }
  }

  /**
   * 随机模拟用户状态变化(仅在模拟模式下可用)
   */
  simulateUserStatusChange() {
    if (this.isMockMode && this.mockServer) {
      this.mockServer.simulateUserStatusChange();
    }
  }

  /**
   * 设置当前用户ID(仅在模拟模式下可用)
   * @param userId 用户ID
   */
  setCurrentUserId(userId: number) {
    if (this.isMockMode && this.mockServer) {
      this.mockServer.setCurrentUserId(userId);
    }
  }

  /**
   * 模拟回复(仅在模拟模式下可用)
   * @param userId 用户ID
   */
  simulateReply(userId: number) {
    if (this.isMockMode && this.mockServer) {
      this.mockServer.simulateReply(userId);
    }
  }
}

// 创建并导出桥接实例
export const wsBridge = new WebSocketBridge(); 