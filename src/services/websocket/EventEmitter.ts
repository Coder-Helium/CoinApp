type Listener = (...args: any[]) => void;

/**
 * 简单的EventEmitter实现，用于替代Node.js的events模块
 * 在React Native环境中使用
 */
class EventEmitter {
  private events: Map<string, Listener[]> = new Map();

  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param listener 监听器函数
   */
  on(event: string, listener: Listener): this {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
    return this;
  }

  /**
   * 注册一次性事件监听器
   * @param event 事件名称
   * @param listener 监听器函数
   */
  once(event: string, listener: Listener): this {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    this.on(event, onceWrapper);
    return this;
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param listener 要移除的监听器函数
   */
  off(event: string, listener?: Listener): this {
    if (!this.events.has(event)) {
      return this;
    }
    
    // 如果没有提供监听器，移除所有该事件的监听器
    if (!listener) {
      this.events.delete(event);
      return this;
    }
    
    const eventListeners = this.events.get(event)!;
    const index = eventListeners.indexOf(listener);
    if (index !== -1) {
      eventListeners.splice(index, 1);
      if (eventListeners.length === 0) {
        this.events.delete(event);
      }
    }
    
    return this;
  }

  /**
   * 移除指定事件的所有监听器
   * @param event 事件名称
   */
  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给监听器的参数
   */
  emit(event: string, ...args: any[]): boolean {
    if (this.events.has(event)) {
      const eventListeners = [...this.events.get(event)!];
      for (const listener of eventListeners) {
        try {
          listener.apply(this, args);
        } catch (error) {
          console.error(`错误发生在事件"${event}"的监听器中:`, error);
        }
      }
      return true;
    }
    return false;
  }

  /**
   * 获取指定事件的监听器数量
   * @param event 事件名称
   */
  listenerCount(event: string): number {
    return this.events.has(event) ? this.events.get(event)!.length : 0;
  }

  /**
   * 获取指定事件的所有监听器
   * @param event 事件名称
   */
  listeners(event: string): Listener[] {
    return this.events.has(event) ? [...this.events.get(event)!] : [];
  }
}

export default EventEmitter; 