import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ViewType, Employee, Task, SystemStatus, Notification } from '../types/index.js';
import { createWebSocketService, type WebSocketService } from '../services/websocket.js';
import './linglong-header.js';
import './linglong-sidebar.js';

@customElement('linglong-dashboard')
export class LinglongDashboard extends LitElement {
  @state() private currentView: ViewType = 'organization';
  @state() private sidebarCollapsed = false;
  @state() private employees: Employee[] = [];
  @state() private tasks: Task[] = [];
  @state() private systemStatus: SystemStatus | null = null;
  @state() private notifications: Notification[] = [];
  @state() private isLoading = true;
  @state() private wsConnected = false;
  @state() private error: string | null = null;

  private wsService: WebSocketService | null = null;

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .dashboard {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--ll-bg-primary);
    }

    .dashboard-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow: auto;
      padding: 24px;
      background: linear-gradient(135deg, var(--ll-bg-primary) 0%, var(--ll-primary-dark) 100%);
    }

    .content-header {
      margin-bottom: 24px;
    }

    .content-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--ll-text-primary);
      margin-bottom: 8px;
    }

    .content-subtitle {
      font-size: 14px;
      color: var(--ll-text-secondary);
    }

    .view-container {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 组织架构视图 */
    .org-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .org-card {
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .org-card:hover {
      border-color: var(--ll-accent);
      box-shadow: 0 0 20px rgba(237, 137, 54, 0.1);
    }

    .org-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .org-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .org-card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .org-card-count {
      font-size: 12px;
      color: var(--ll-text-secondary);
    }

    .org-members {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .org-member {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: var(--ll-bg-tertiary);
      border-radius: 20px;
      font-size: 12px;
    }

    .org-member-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--ll-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      color: white;
    }

    /* 任务看板视图 */
    .kanban-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      min-width: 800px;
    }

    .kanban-column {
      background: var(--ll-bg-secondary);
      border-radius: 12px;
      padding: 16px;
      min-height: 400px;
    }

    .kanban-column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--ll-border);
    }

    .kanban-column-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .kanban-column-count {
      padding: 2px 8px;
      background: var(--ll-bg-tertiary);
      border-radius: 10px;
      font-size: 12px;
      color: var(--ll-text-secondary);
    }

    .kanban-tasks {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .kanban-task {
      background: var(--ll-bg-tertiary);
      border: 1px solid var(--ll-border);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .kanban-task:hover {
      border-color: var(--ll-accent);
      transform: translateY(-2px);
    }

    .kanban-task-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--ll-text-primary);
      margin-bottom: 8px;
    }

    .kanban-task-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .kanban-task-priority {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .kanban-task-priority.urgent {
      background: rgba(239, 68, 68, 0.2);
      color: var(--ll-error);
    }

    .kanban-task-priority.high {
      background: rgba(245, 158, 11, 0.2);
      color: var(--ll-warning);
    }

    .kanban-task-priority.medium {
      background: rgba(59, 130, 246, 0.2);
      color: var(--ll-info);
    }

    .kanban-task-priority.low {
      background: rgba(16, 185, 129, 0.2);
      color: var(--ll-success);
    }

    .kanban-task-assignee {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--ll-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
    }

    /* 监控视图 */
    .monitor-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .monitor-card {
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      padding: 20px;
    }

    .monitor-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .monitor-card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .monitor-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .monitor-status.healthy {
      background: rgba(16, 185, 129, 0.1);
      color: var(--ll-success);
    }

    .monitor-status.warning {
      background: rgba(245, 158, 11, 0.1);
      color: var(--ll-warning);
    }

    .monitor-status.error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--ll-error);
    }

    .monitor-metric {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .monitor-metric-value {
      font-size: 32px;
      font-weight: 700;
      color: var(--ll-text-primary);
    }

    .monitor-metric-unit {
      font-size: 14px;
      color: var(--ll-text-secondary);
    }

    /* 快捷操作视图 */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      border-color: var(--ll-accent);
      background: var(--ll-bg-tertiary);
      transform: translateY(-4px);
      box-shadow: var(--ll-shadow-lg);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: var(--ll-shadow-glow);
    }

    .action-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .action-desc {
      font-size: 12px;
      color: var(--ll-text-secondary);
      text-align: center;
    }

    /* 加载状态 */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--ll-bg-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 9999;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(237, 137, 54, 0.3);
      border-top-color: var(--ll-accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 14px;
      color: var(--ll-text-secondary);
    }

    /* 错误状态 */
    .error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--ll-bg-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 9999;
    }

    .error-icon {
      font-size: 64px;
    }

    .error-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--ll-error);
    }

    .error-message {
      font-size: 14px;
      color: var(--ll-text-secondary);
      max-width: 400px;
      text-align: center;
    }

    .error-retry {
      margin-top: 16px;
      padding: 10px 24px;
      background: var(--ll-accent);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .error-retry:hover {
      background: var(--ll-accent-light);
    }

    /* 响应式 */
    @media (max-width: 1200px) {
      .kanban-board {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .monitor-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }
      
      .monitor-grid {
        grid-template-columns: 1fr;
      }
      
      .org-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this.initializeWebSocket();
    this.loadInitialData();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.wsService?.disconnect();
  }

  private initializeWebSocket(): void {
    this.wsService = createWebSocketService({
      url: 'ws://127.0.0.1:18789/ws',
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      onOpen: () => {
        console.log('[Dashboard] WebSocket 已连接');
        this.wsConnected = true;
      },
      onClose: () => {
        console.log('[Dashboard] WebSocket 已断开');
        this.wsConnected = false;
      },
      onError: (error) => {
        console.error('[Dashboard] WebSocket 错误:', error);
      },
      onMessage: (message) => {
        this.handleWebSocketMessage(message);
      }
    });

    this.wsService.connect();
  }

  private handleWebSocketMessage(message: { type: string; payload: unknown }): void {
    switch (message.type) {
      case 'task_update':
        this.handleTaskUpdate(message.payload as Task);
        break;
      case 'employee_update':
        this.handleEmployeeUpdate(message.payload as Employee);
        break;
      case 'system_status':
        this.systemStatus = message.payload as SystemStatus;
        break;
      case 'notification':
        this.handleNotification(message.payload as Notification);
        break;
    }
  }

  private handleTaskUpdate(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      this.tasks = [
        ...this.tasks.slice(0, index),
        task,
        ...this.tasks.slice(index + 1)
      ];
    } else {
      this.tasks = [...this.tasks, task];
    }
  }

  private handleEmployeeUpdate(employee: Employee): void {
    const index = this.employees.findIndex(e => e.id === employee.id);
    if (index >= 0) {
      this.employees = [
        ...this.employees.slice(0, index),
        employee,
        ...this.employees.slice(index + 1)
      ];
    }
  }

  private handleNotification(notification: Notification): void {
    this.notifications = [notification, ...this.notifications];
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      
      // 模拟加载数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟员工数据
      this.employees = this.generateMockEmployees();
      
      // 模拟任务数据
      this.tasks = this.generateMockTasks();
      
      // 模拟系统状态
      this.systemStatus = this.generateMockSystemStatus();
      
      this.isLoading = false;
    } catch (err) {
      this.error = err instanceof Error ? err.message : '加载失败';
      this.isLoading = false;
    }
  }

  private generateMockEmployees(): Employee[] {
    const departments: Array<'office' | 'marketing' | 'development' | 'operations' | 'security' | 'publicity'> = ['office', 'marketing', 'development', 'operations', 'security', 'publicity'];
    const names = ['张伟', '李娜', '王强', '刘洋', '陈静', '杨帆', '赵敏', '黄磊', '周杰', '吴倩', '徐鹏', '孙丽', '马超', '朱婷', '胡军', '郭芳', '林峰', '何婷', '罗刚'];
    
    return names.map((name, i) => ({
      id: `emp_${i}`,
      name,
      department: departments[i % departments.length],
      position: ['总监', '经理', '高级工程师', '工程师', '专员'][i % 5],
      level: [9, 8, 7, 6, 5][i % 5],
      status: ['online', 'busy', 'offline', 'away'][i % 4] as Employee['status'],
      email: `${name}@linglong.group`
    })) as Employee[];
  }

  private generateMockTasks(): Task[] {
    const statuses: Array<'todo' | 'in_progress' | 'review' | 'done'> = ['todo', 'in_progress', 'review', 'done'];
    const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `task_${i}`,
      title: `任务 ${i + 1}: ${['设计新功能', '修复Bug', '代码审查', '文档编写', '性能优化'][i % 5]}`,
      description: '这是一个示例任务描述',
      status: statuses[i % 4],
      priority: priorities[i % 4],
      assignee: this.employees[i % this.employees.length],
      creator: this.employees[0],
      department: 'development' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['前端', '后端', '设计'][i % 3].split(',')
    })) as Task[];
  }

  private generateMockSystemStatus(): SystemStatus {
    return {
      gateway: {
        name: 'Gateway',
        status: 'healthy',
        uptime: 86400,
        lastCheck: new Date(),
        message: '运行正常'
      },
      database: {
        name: 'Database',
        status: 'healthy',
        uptime: 86400,
        lastCheck: new Date(),
        message: '连接正常'
      },
      websocket: {
        name: 'WebSocket',
        status: this.wsConnected ? 'healthy' : 'warning',
        uptime: 3600,
        lastCheck: new Date(),
        message: this.wsConnected ? '连接正常' : '连接中...'
      },
      agents: [
        { id: 'agent_1', name: '灵枢', status: 'busy', currentTask: '处理任务', lastHeartbeat: new Date() },
        { id: 'agent_2', name: '灵市', status: 'idle', lastHeartbeat: new Date() },
        { id: 'agent_3', name: '灵码', status: 'busy', currentTask: '代码生成', lastHeartbeat: new Date() }
      ]
    };
  }

  private handleViewChange(e: CustomEvent<{ view: ViewType }>): void {
    this.currentView = e.detail.view;
  }

  private handleSidebarToggle(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private renderOrganizationView() {
    const departments = [
      { id: 'office', name: '集团办公室', icon: '🏢', color: '#1a365d' },
      { id: 'marketing', name: '市场部', icon: '📈', color: '#ed8936' },
      { id: 'development', name: '开发部', icon: '💻', color: '#3b82f6' },
      { id: 'operations', name: '运营部', icon: '⚙️', color: '#10b981' },
      { id: 'security', name: '安全部', icon: '🛡️', color: '#ef4444' },
      { id: 'publicity', name: '宣传部', icon: '📢', color: '#8b5cf6' }
    ];

    return html`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">组织架构</h1>
          <p class="content-subtitle">灵笼集团 19 人团队实时状态</p>
        </div>
        <div class="org-grid">
          ${departments.map(dept => {
            const deptEmployees = this.employees.filter(e => e.department === dept.id);
            return html`
              <div class="org-card">
                <div class="org-card-header">
                  <div class="org-card-icon" style="background: ${dept.color}20; color: ${dept.color}">
                    ${dept.icon}
                  </div>
                  <div>
                    <div class="org-card-title">${dept.name}</div>
                    <div class="org-card-count">${deptEmployees.length} 人</div>
                  </div>
                </div>
                <div class="org-members">
                  ${deptEmployees.slice(0, 5).map(emp => html`
                    <div class="org-member">
                      <div class="org-member-avatar">${emp.name.charAt(0)}</div>
                      <span>${emp.name}</span>
                    </div>
                  `)}
                  ${deptEmployees.length > 5 ? html`
                    <div class="org-member">
                      <span>+${deptEmployees.length - 5}</span>
                    </div>
                  ` : null}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private renderKanbanView() {
    const columns = [
      { id: 'todo', title: '待办', color: '#94a3b8' },
      { id: 'in_progress', title: '进行中', color: '#3b82f6' },
      { id: 'review', title: '审核中', color: '#f59e0b' },
      { id: 'done', title: '已完成', color: '#10b981' }
    ];

    return html`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">任务看板</h1>
          <p class="content-subtitle">实时任务追踪与管理</p>
        </div>
        <div class="kanban-board">
          ${columns.map(col => {
            const colTasks = this.tasks.filter(t => t.status === col.id);
            return html`
              <div class="kanban-column">
                <div class="kanban-column-header">
                  <div class="kanban-column-title">
                    <span style="color: ${col.color}">●</span>
                    ${col.title}
                  </div>
                  <span class="kanban-column-count">${colTasks.length}</span>
                </div>
                <div class="kanban-tasks">
                  ${colTasks.map(task => html`
                    <div class="kanban-task">
                      <div class="kanban-task-title">${task.title}</div>
                      <div class="kanban-task-meta">
                        <span class="kanban-task-priority ${task.priority}">
                          ${task.priority}
                        </span>
                        ${task.assignee ? html`
                          <div class="kanban-task-assignee">
                            ${task.assignee.name.charAt(0)}
                          </div>
                        ` : null}
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private renderMonitorView() {
    if (!this.systemStatus) return html`<div>加载中...</div>`;

    return html`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">实时监控</h1>
          <p class="content-subtitle">系统状态与性能监控</p>
        </div>
        <div class="monitor-grid">
          <div class="monitor-card">
            <div class="monitor-card-header">
              <span class="monitor-card-title">Gateway</span>
              <span class="monitor-status ${this.systemStatus.gateway.status}">
                ${this.systemStatus.gateway.status === 'healthy' ? '● 正常' : '● 异常'}
              </span>
            </div>
            <div class="monitor-metric">
              <span class="monitor-metric-value">99.9%</span>
              <span class="monitor-metric-unit">可用性</span>
            </div>
          </div>

          <div class="monitor-card">
            <div class="monitor-card-header">
              <span class="monitor-card-title">数据库</span>
              <span class="monitor-status ${this.systemStatus.database.status}">
                ${this.systemStatus.database.status === 'healthy' ? '● 正常' : '● 异常'}
              </span>
            </div>
            <div class="monitor-metric">
              <span class="monitor-metric-value">24</span>
              <span class="monitor-metric-unit">ms 响应</span>
            </div>
          </div>

          <div class="monitor-card">
            <div class="monitor-card-header">
              <span class="monitor-card-title">WebSocket</span>
              <span class="monitor-status ${this.wsConnected ? 'healthy' : 'warning'}">
                ${this.wsConnected ? '● 已连接' : '● 连接中'}
              </span>
            </div>
            <div class="monitor-metric">
              <span class="monitor-metric-value">${this.employees.filter(e => e.status === 'online').length}</span>
              <span class="monitor-metric-unit">在线用户</span>
            </div>
          </div>

          <div class="monitor-card" style="grid-column: span 3;">
            <div class="monitor-card-header">
              <span class="monitor-card-title">Agent 状态</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
              ${this.systemStatus.agents.map(agent => html`
                <div style="padding: 12px; background: var(--ll-bg-tertiary); border-radius: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="color: ${agent.status === 'busy' ? 'var(--ll-warning)' : 'var(--ll-success)'};">●</span>
                    <span style="font-weight: 600;">${agent.name}</span>
                  </div>
                  <div style="font-size: 12px; color: var(--ll-text-secondary);">
                    ${agent.currentTask || '空闲中'}
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderActionsView() {
    const actions = [
      { id: 'new-task', icon: '➕', title: '新建任务', desc: '创建新的工作任务' },
      { id: 'new-meeting', icon: '📅', title: '预约会议', desc: '安排团队会议' },
      { id: 'send-msg', icon: '💬', title: '发送消息', desc: '给团队成员发消息' },
      { id: 'view-report', icon: '📊', title: '查看报表', desc: '查看数据报表' },
      { id: 'settings', icon: '⚙️', title: '系统设置', desc: '配置系统参数' },
      { id: 'help', icon: '❓', title: '帮助中心', desc: '获取使用帮助' }
    ];

    return html`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">快捷操作</h1>
          <p class="content-subtitle">常用功能快速入口</p>
        </div>
        <div class="actions-grid">
          ${actions.map(action => html`
            <div class="action-card" @click=${() => this.handleAction(action.id)}>
              <div class="action-icon">${action.icon}</div>
              <div class="action-title">${action.title}</div>
              <div class="action-desc">${action.desc}</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private handleAction(actionId: string): void {
    console.log('执行操作:', actionId);
    // TODO: 实现具体操作
  }

  override render() {
    if (this.isLoading) {
      return html`
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
          <div class="loading-text">灵笼看板加载中...</div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-overlay">
          <div class="error-icon">❌</div>
          <div class="error-title">加载失败</div>
          <div class="error-message">${this.error}</div>
          <button class="error-retry" @click=${() => this.loadInitialData()}>重试</button>
        </div>
      `;
    }

    return html`
      <div class="dashboard">
        <linglong-header
          .currentView=${this.currentView}
          @view-change=${this.handleViewChange}
        ></linglong-header>
        
        <div class="dashboard-body">
          <linglong-sidebar
            ?collapsed=${this.sidebarCollapsed}
            .employees=${this.employees}
            @toggle-collapse=${this.handleSidebarToggle}
          ></linglong-sidebar>
          
          <main class="main-content">
            ${this.currentView === 'organization' ? this.renderOrganizationView() :
              this.currentView === 'kanban' ? this.renderKanbanView() :
              this.currentView === 'monitor' ? this.renderMonitorView() :
              this.renderActionsView()}
          </main>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'linglong-dashboard': LinglongDashboard;
  }
}
