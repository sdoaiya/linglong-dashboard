import type { WSMessage, WSMessageType } from '../types/index.js';

export interface WebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WSMessage) => void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private heartbeatInterval: number;
  private reconnectAttempts = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionallyClosed = false;
  private messageHandlers: Map<WSMessageType, ((payload: unknown) => void)[]> = new Map();
  
  private onOpenCallback?: () => void;
  private onCloseCallback?: (event: CloseEvent) => void;
  private onErrorCallback?: (error: Event) => void;
  private onMessageCallback?: (message: WSMessage) => void;

  constructor(options: WebSocketOptions) {
    this.url = options.url;
    this.reconnectInterval = options.reconnectInterval ?? 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
    this.heartbeatInterval = options.heartbeatInterval ?? 30000;
    this.onOpenCallback = options.onOpen;
    this.onCloseCallback = options.onClose;
    this.onErrorCallback = options.onError;
    this.onMessageCallback = options.onMessage;
  }

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] 已连接');
      return;
    }

    this.isIntentionallyClosed = false;
    
    try {
      console.log(`[WebSocket] 连接到: ${this.url}`);
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('[WebSocket] 连接失败:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    console.log('[WebSocket] 主动断开连接');
    this.isIntentionallyClosed = true;
    this.clearTimers();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 发送消息
   */
  send(type: WSMessageType, payload: unknown): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] 连接未就绪，无法发送消息');
      return false;
    }

    const message: WSMessage = {
      type,
      payload,
      timestamp: Date.now(),
      id: this.generateMessageId()
    };

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('[WebSocket] 发送消息失败:', error);
      return false;
    }
  }

  /**
   * 订阅特定类型的消息
   */
  on(type: WSMessageType, handler: (payload: unknown) => void): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    const handlers = this.messageHandlers.get(type)!;
    handlers.push(handler);
    
    // 返回取消订阅函数
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * 发送心跳
   */
  ping(): boolean {
    return this.send('ping', {});
  }

  /**
   * 获取连接状态
   */
  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 处理连接打开
   */
  private handleOpen(): void {
    console.log('[WebSocket] 连接成功');
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.onOpenCallback?.();
  }

  /**
   * 处理连接关闭
   */
  private handleClose(event: CloseEvent): void {
    console.log(`[WebSocket] 连接关闭: code=${event.code}, reason=${event.reason}`);
    this.clearTimers();
    this.onCloseCallback?.(event);
    
    if (!this.isIntentionallyClosed) {
      this.scheduleReconnect();
    }
  }

  /**
   * 处理错误
   */
  private handleError(error: Event): void {
    console.error('[WebSocket] 错误:', error);
    this.onErrorCallback?.(error);
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WSMessage = JSON.parse(event.data);
      console.log('[WebSocket] 收到消息:', message.type);
      
      // 处理 pong 响应
      if (message.type === 'pong') {
        return;
      }
      
      // 调用全局消息回调
      this.onMessageCallback?.(message);
      
      // 调用特定类型的处理器
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message.payload);
          } catch (error) {
            console.error(`[WebSocket] 消息处理器错误 (${message.type}):`, error);
          }
        });
      }
    } catch (error) {
      console.error('[WebSocket] 解析消息失败:', error);
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] 达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.min(this.reconnectAttempts, 5);
    
    console.log(`[WebSocket] ${delay}ms 后尝试第 ${this.reconnectAttempts} 次重连...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.ping();
      }
    }, this.heartbeatInterval);
  }

  /**
   * 清除定时器
   */
  private clearTimers(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 生成消息ID
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 创建单例实例
let wsInstance: WebSocketService | null = null;

export function getWebSocketService(options?: WebSocketOptions): WebSocketService {
  if (!wsInstance && options) {
    wsInstance = new WebSocketService(options);
  }
  return wsInstance!;
}

export function createWebSocketService(options: WebSocketOptions): WebSocketService {
  return new WebSocketService(options);
}
