# 架构文档

## 概述

灵笼看板是一个基于 Lit + TypeScript 的单页应用，采用组件化架构设计。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ linglong-    │ │ linglong-    │ │ linglong-dashboard   │ │
│  │ header       │ │ sidebar      │ │ (主容器)             │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        业务组件层                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ 组织架构视图  │ │ 任务看板视图  │ │ 实时监控视图         │ │
│  │ (organization)│ │ (kanban)    │ │ (monitor)            │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        服务层                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ WebSocket    │ │ OrgService   │ │ TaskService          │ │
│  │ Service      │ │              │ │                      │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        数据层                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ Gateway API  │ │ LocalStorage │ │ Mock Data            │ │
│  │ (WebSocket)  │ │ (配置缓存)   │ │ (开发环境)           │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 组件架构

### 主组件

```
linglong-dashboard (主容器)
├── linglong-header (顶部导航)
│   ├── 视图切换器
│   ├── 搜索框
│   └── 用户头像
├── linglong-sidebar (侧边栏)
│   ├── 部门列表
│   ├── 员工列表
│   └── 快速链接
└── main-content (主内容区)
    ├── organization-view (组织架构)
    ├── kanban-view (任务看板)
    ├── monitor-view (实时监控)
    └── actions-view (快捷操作)
```

### 组件通信

```
┌──────────────────────────────────────────────────────┐
│                    事件总线                          │
│                                                      │
│  CustomEvent('view-change')                          │
│  CustomEvent('task-update')                          │
│  CustomEvent('employee-update')                      │
│  CustomEvent('notification')                         │
└──────────────────────────────────────────────────────┘
```

## 状态管理

### 本地状态

使用 Lit 的 `@state` 装饰器管理组件内部状态：

```typescript
@state() private currentView: ViewType = 'organization';
@state() private employees: Employee[] = [];
@state() private tasks: Task[] = [];
```

### 全局状态

通过 WebSocket 实时同步：

```typescript
// WebSocket 消息驱动状态更新
private handleWebSocketMessage(message: WebSocketMessage) {
  switch (message.type) {
    case 'task_update':
      this.updateTask(message.payload);
      break;
    case 'employee_update':
      this.updateEmployee(message.payload);
      break;
  }
}
```

## 样式架构

### CSS 变量系统

```css
:root {
  /* 主色调 */
  --ll-primary: #1a365d;
  --ll-primary-light: #2c5282;
  --ll-primary-dark: #0f172a;
  
  /* 强调色 */
  --ll-accent: #ed8936;
  --ll-accent-light: #f6ad55;
  --ll-accent-dark: #c05621;
  
  /* 功能色 */
  --ll-success: #48bb78;
  --ll-warning: #ecc94b;
  --ll-error: #f56565;
  --ll-info: #3b82f6;
  
  /* 背景色 */
  --ll-bg-primary: #0f172a;
  --ll-bg-secondary: #1e293b;
  --ll-bg-tertiary: #334155;
  
  /* 文字色 */
  --ll-text-primary: #f1f5f9;
  --ll-text-secondary: #94a3b8;
  --ll-text-muted: #64748b;
  
  /* 边框 */
  --ll-border: #334155;
  
  /* 阴影 */
  --ll-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --ll-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --ll-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  --ll-shadow-glow: 0 0 20px rgba(237, 137, 54, 0.3);
}
```

### 主题切换

支持深色/浅色主题：

```typescript
// 主题切换
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}
```

## 构建流程

```
开发环境                    构建流程                    生产环境
─────────→                  ─────────→                  ─────────→
TypeScript 源码            Vite 构建                   优化后的
  ↓                         ↓                           静态文件
ESLint 检查               Rollup 打包                  ↓
  ↓                         ↓                        部署到
类型检查                  代码压缩                    GitHub Pages
  ↓                         ↓                           ↓
Vite Dev Server          生成 Source Map           CDN 分发
```

## 性能优化

### 1. 代码分割

```typescript
// 动态导入
const HeavyComponent = await import('./components/heavy-component.js');
```

### 2. 虚拟滚动

```typescript
// 大数据列表使用虚拟滚动
render() {
  return html`
    <virtual-scroll .items=${this.employees}>
      ${(emp) => html`<employee-card .employee=${emp}></employee-card>`}
    </virtual-scroll>
  `;
}
```

### 3. 懒加载

```typescript
// 图片懒加载
render() {
  return html`
    <img 
      loading="lazy" 
      src="${employee.avatar}" 
      alt="${employee.name}"
    />
  `;
}
```

## 安全考虑

### XSS 防护

- 使用 Lit 的 `html` 模板自动转义
- 用户输入使用 DOMPurify 清理

### CSRF 防护

- WebSocket 连接使用 Token 认证
- 敏感操作需要二次确认

### 内容安全策略

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' ws://localhost:18789;
">
```

## 扩展性设计

### 插件系统

```typescript
interface DashboardPlugin {
  name: string;
  version: string;
  install(dashboard: LinglongDashboard): void;
}

// 注册插件
const plugin: DashboardPlugin = {
  name: 'custom-metrics',
  version: '1.0.0',
  install(dashboard) {
    dashboard.registerView('custom', CustomView);
  }
};
```

### 主题扩展

```typescript
// 自定义主题
dashboard.registerTheme('custom', {
  primary: '#your-color',
  accent: '#your-accent',
  // ...
});
```
