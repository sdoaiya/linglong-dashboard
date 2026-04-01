import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Notification, ViewType } from '../types/index.js';

@customElement('linglong-header')
export class LinglongHeader extends LitElement {
  @property({ type: String }) currentView: ViewType = 'organization';
  @property({ type: String }) userName = '管理员';
  @property({ type: String }) userAvatar = '';
  
  @state() private notifications: Notification[] = [];
  @state() private showNotifications = false;
  @state() private currentTime = new Date();
  @state() private isOnline = true;

  private timeInterval?: ReturnType<typeof setInterval>;

  static styles = css`
    :host {
      display: block;
      height: 64px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 24px;
      background: linear-gradient(135deg, var(--ll-primary) 0%, var(--ll-primary-dark) 100%);
      border-bottom: 1px solid var(--ll-border);
      box-shadow: var(--ll-shadow);
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: var(--ll-shadow-glow);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: white;
      letter-spacing: 0.05em;
    }

    .logo-subtitle {
      font-size: 11px;
      color: var(--ll-text-secondary);
      letter-spacing: 0.1em;
    }

    .nav-tabs {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 32px;
    }

    .nav-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--ll-text-secondary);
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-tab:hover {
      color: var(--ll-text-primary);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-tab.active {
      color: white;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      box-shadow: var(--ll-shadow-sm);
    }

    .nav-tab .icon {
      font-size: 16px;
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 20px;
      font-size: 12px;
      color: var(--ll-success);
    }

    .status-indicator.offline {
      background: rgba(239, 68, 68, 0.1);
      color: var(--ll-error);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      animation: pulse 2s ease-in-out infinite;
    }

    .status-indicator.offline .status-dot {
      animation: none;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .time-display {
      font-family: var(--ll-font-mono);
      font-size: 14px;
      color: var(--ll-text-secondary);
      letter-spacing: 0.05em;
    }

    .notification-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 18px;
    }

    .notification-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      background: var(--ll-error);
      border-radius: 9px;
      font-size: 11px;
      font-weight: 600;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px 6px 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-profile:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: white;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--ll-text-primary);
    }

    .notification-dropdown {
      position: absolute;
      top: 72px;
      right: 24px;
      width: 360px;
      max-height: 480px;
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      box-shadow: var(--ll-shadow-lg);
      z-index: 1000;
      overflow: hidden;
    }

    .notification-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--ll-border);
    }

    .notification-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .notification-clear {
      font-size: 12px;
      color: var(--ll-accent);
      cursor: pointer;
      background: none;
      border: none;
    }

    .notification-clear:hover {
      text-decoration: underline;
    }

    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--ll-border);
      cursor: pointer;
      transition: background 0.2s;
    }

    .notification-item:hover {
      background: var(--ll-bg-tertiary);
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .notification-icon.info { background: rgba(59, 130, 246, 0.1); }
    .notification-icon.success { background: rgba(16, 185, 129, 0.1); }
    .notification-icon.warning { background: rgba(245, 158, 11, 0.1); }
    .notification-icon.error { background: rgba(239, 68, 68, 0.1); }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--ll-text-primary);
      margin-bottom: 4px;
    }

    .notification-item-message {
      font-size: 12px;
      color: var(--ll-text-secondary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notification-item-time {
      font-size: 11px;
      color: var(--ll-text-tertiary);
      margin-top: 4px;
    }

    .notification-empty {
      padding: 48px 24px;
      text-align: center;
      color: var(--ll-text-secondary);
    }

    .notification-empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this.startClock();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private startClock(): void {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  }

  private handleViewChange(view: ViewType): void {
    this.dispatchEvent(new CustomEvent('view-change', {
      detail: { view },
      bubbles: true,
      composed: true
    }));
  }

  private toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  private getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  override render() {
    const views: { id: ViewType; label: string; icon: string }[] = [
      { id: 'organization', label: '组织架构', icon: '🏢' },
      { id: 'kanban', label: '任务看板', icon: '📋' },
      { id: 'monitor', label: '实时监控', icon: '📊' },
      { id: 'actions', label: '快捷操作', icon: '⚡' }
    ];

    return html`
      <header class="header">
        <div class="left-section">
          <div class="logo" @click=${() => this.handleViewChange('organization')}>
            <div class="logo-icon">🐉</div>
            <div class="logo-text">
              <span class="logo-title">灵笼看板</span>
              <span class="logo-subtitle">LINGLONG DASHBOARD</span>
            </div>
          </div>
          
          <nav class="nav-tabs">
            ${views.map(view => html`
              <button 
                class="nav-tab ${this.currentView === view.id ? 'active' : ''}"
                @click=${() => this.handleViewChange(view.id)}
              >
                <span class="icon">${view.icon}</span>
                <span>${view.label}</span>
              </button>
            `)}
          </nav>
        </div>

        <div class="right-section">
          <div class="status-indicator ${this.isOnline ? '' : 'offline'}">
            <span class="status-dot"></span>
            <span>${this.isOnline ? '系统正常' : '离线中'}</span>
          </div>
          
          <div class="time-display">
            ${this.formatDate(this.currentTime)} ${this.formatTime(this.currentTime)}
          </div>

          <button class="notification-btn" @click=${this.toggleNotifications}>
            🔔
            ${this.getUnreadCount() > 0 ? html`
              <span class="notification-badge">${this.getUnreadCount()}</span>
            ` : null}
          </button>

          <div class="user-profile">
            <div class="user-avatar">
              ${this.userAvatar 
                ? html`<img src="${this.userAvatar}" alt="${this.userName}">`
                : this.userName.charAt(0)
              }
            </div>
            <span class="user-name">${this.userName}</span>
          </div>
        </div>
      </header>

      ${this.showNotifications ? html`
        <div class="notification-dropdown">
          <div class="notification-header">
            <span class="notification-title">通知</span>
            ${this.notifications.length > 0 ? html`
              <button class="notification-clear" @click=${() => {/* TODO */}}>
                全部已读
              </button>
            ` : null}
          </div>
          <div class="notification-list">
            ${this.notifications.length === 0 ? html`
              <div class="notification-empty">
                <div class="notification-empty-icon">📭</div>
                <div>暂无通知</div>
              </div>
            ` : this.notifications.map(n => html`
              <div class="notification-item">
                <div class="notification-icon ${n.type}">
                  ${n.type === 'info' ? 'ℹ️' : 
                    n.type === 'success' ? '✅' : 
                    n.type === 'warning' ? '⚠️' : '❌'}
                </div>
                <div class="notification-content">
                  <div class="notification-item-title">${n.title}</div>
                  <div class="notification-item-message">${n.message}</div>
                  <div class="notification-item-time">
                    ${new Date(n.timestamp).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>
            `)}
          </div>
        </div>
      ` : null}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'linglong-header': LinglongHeader;
  }
}
