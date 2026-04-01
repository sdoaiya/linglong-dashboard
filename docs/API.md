# API 文档

灵笼看板提供完整的 WebSocket API 用于实时通信。

## 🔌 WebSocket 连接

```typescript
const ws = new WebSocket('ws://127.0.0.1:18789/ws');
```

### 连接参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | WebSocket 服务器地址 |
| reconnectInterval | number | 重连间隔（毫秒） |
| maxReconnectAttempts | number | 最大重连次数 |
| heartbeatInterval | number | 心跳间隔（毫秒） |

## 📨 消息协议

### 消息格式

```typescript
interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: number;
  id: string;
}
```

### 消息类型

#### 1. 任务更新 (task_update)

```typescript
{
  type: 'task_update',
  payload: {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee: Employee;
    department: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
  }
}
```

#### 2. 员工更新 (employee_update)

```typescript
{
  type: 'employee_update',
  payload: {
    id: string;
    name: string;
    department: string;
    position: string;
    level: number;
    status: 'online' | 'offline' | 'busy' | 'away';
    email: string;
    currentTask?: string;
  }
}
```

#### 3. 系统状态 (system_status)

```typescript
{
  type: 'system_status',
  payload: {
    gateway: {
      name: string;
      status: 'healthy' | 'warning' | 'error';
      uptime: number;
      lastCheck: Date;
      message: string;
    };
    database: {
      name: string;
      status: 'healthy' | 'warning' | 'error';
      uptime: number;
      lastCheck: Date;
      message: string;
    };
    websocket: {
      name: string;
      status: 'healthy' | 'warning' | 'error';
      uptime: number;
      lastCheck: Date;
      message: string;
    };
    agents: Array<{
      id: string;
      name: string;
      status: 'idle' | 'busy';
      currentTask?: string;
      lastHeartbeat: Date;
    }>;
  }
}
```

#### 4. 通知消息 (notification)

```typescript
{
  type: 'notification',
  payload: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
  }
}
```

## 🔧 客户端 API

### WebSocket 服务

```typescript
import { createWebSocketService } from './services/websocket.js';

const wsService = createWebSocketService({
  url: 'ws://127.0.0.1:18789/ws',
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  onOpen: () => console.log('已连接'),
  onClose: () => console.log('已断开'),
  onError: (error) => console.error('错误:', error),
  onMessage: (message) => console.log('消息:', message)
});

wsService.connect();
wsService.disconnect();
```

### 组织架构服务

```typescript
import { OrgService } from './services/org-service.js';

const orgService = new OrgService();

// 获取所有员工
const employees = await orgService.getEmployees();

// 获取部门员工
const devEmployees = await orgService.getEmployeesByDepartment('development');

// 更新员工状态
await orgService.updateEmployeeStatus('emp_1', 'busy');
```

### 任务服务

```typescript
import { TaskService } from './services/task-service.js';

const taskService = new TaskService();

// 获取所有任务
const tasks = await taskService.getTasks();

// 获取任务按状态
const todoTasks = await taskService.getTasksByStatus('todo');

// 创建任务
const newTask = await taskService.createTask({
  title: '新任务',
  description: '任务描述',
  priority: 'high',
  assignee: 'emp_1'
});

// 更新任务状态
await taskService.updateTaskStatus('task_1', 'in_progress');
```

## 📊 数据模型

### Employee (员工)

```typescript
interface Employee {
  id: string;              // 唯一标识
  name: string;            // 姓名
  department: string;      // 部门
  position: string;        // 职位
  level: number;           // 职级 (5-9)
  status: 'online' | 'offline' | 'busy' | 'away';
  email: string;           // 邮箱
  avatar?: string;         // 头像 URL
  currentTask?: string;    // 当前任务
}
```

### Task (任务)

```typescript
interface Task {
  id: string;              // 唯一标识
  title: string;           // 标题
  description: string;     // 描述
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: Employee;      // 负责人
  creator: Employee;       // 创建者
  department: string;      // 所属部门
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  deadline?: Date;         // 截止时间
  tags: string[];          // 标签
  estimatedHours?: number; // 预估工时
  actualHours?: number;    // 实际工时
}
```

### Department (部门)

```typescript
interface Department {
  id: string;              // 唯一标识
  name: string;            // 部门名称
  icon: string;            // 图标
  color: string;           // 主题色
  employeeCount: number;   // 员工数量
  manager?: Employee;      // 部门负责人
}
```

## 🎯 事件监听

### 在组件中监听事件

```typescript
@customElement('ll-example')
export class Example extends LitElement {
  private wsService: WebSocketService | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.initializeWebSocket();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.wsService?.disconnect();
  }

  private initializeWebSocket() {
    this.wsService = createWebSocketService({
      url: 'ws://127.0.0.1:18789/ws',
      onMessage: (message) => this.handleMessage(message)
    });
    this.wsService.connect();
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'task_update':
        this.handleTaskUpdate(message.payload as Task);
        break;
      case 'employee_update':
        this.handleEmployeeUpdate(message.payload as Employee);
        break;
    }
  }
}
```

## 🔐 认证

WebSocket 连接支持 Token 认证：

```typescript
const ws = new WebSocket('ws://127.0.0.1:18789/ws?token=YOUR_TOKEN');
```

或在连接建立后发送认证消息：

```typescript
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    payload: {
      token: 'YOUR_TOKEN'
    }
  }));
};
```

## 📈 错误处理

### 错误消息格式

```typescript
{
  type: 'error',
  payload: {
    code: string;
    message: string;
    details?: unknown;
  }
}
```

### 错误代码

| 代码 | 说明 |
|------|------|
| AUTH_FAILED | 认证失败 |
| CONNECTION_REFUSED | 连接被拒绝 |
| INVALID_MESSAGE | 无效消息格式 |
| PERMISSION_DENIED | 权限不足 |
| RESOURCE_NOT_FOUND | 资源不存在 |
