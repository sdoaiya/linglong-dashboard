import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Department, DEPARTMENT_CONFIG, type Employee } from '../types/index.js';

interface DepartmentStats {
  total: number;
  online: number;
  busy: number;
}

@customElement('linglong-sidebar')
export class LinglongSidebar extends LitElement {
  @property({ type: Boolean }) collapsed = false;
  @property({ type: Array }) employees: Employee[] = [];
  
  @state() private selectedDepartment: Department | null = null;
  @state() private searchQuery = '';
  @state() private expandedDepartments: Set<Department> = new Set([
    Department.OFFICE,
    Department.DEVELOPMENT
  ]);

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--ll-bg-secondary);
      border-right: 1px solid var(--ll-border);
      transition: width 0.3s ease;
    }

    :host([collapsed]) {
      width: 64px;
    }

    :host(:not([collapsed])) {
      width: 280px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--ll-border);
    }

    .sidebar-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: var(--ll-text-secondary);
      transition: all 0.2s;
    }

    .collapse-btn:hover {
      background: var(--ll-bg-tertiary);
      color: var(--ll-text-primary);
    }

    .search-box {
      padding: 12px 16px;
      border-bottom: 1px solid var(--ll-border);
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ll-text-tertiary);
      font-size: 14px;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      font-size: 13px;
      color: var(--ll-text-primary);
      background: var(--ll-bg-tertiary);
      border: 1px solid var(--ll-border);
      border-radius: 8px;
      outline: none;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: var(--ll-accent);
      box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.1);
    }

    .search-input::placeholder {
      color: var(--ll-text-tertiary);
    }

    .department-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .department-item {
      margin-bottom: 4px;
    }

    .department-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .department-header:hover {
      background: var(--ll-bg-tertiary);
    }

    .department-header.active {
      background: rgba(237, 137, 54, 0.1);
    }

    .expand-icon {
      font-size: 12px;
      color: var(--ll-text-tertiary);
      transition: transform 0.2s;
    }

    .expand-icon.expanded {
      transform: rotate(90deg);
    }

    .department-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .department-info {
      flex: 1;
      min-width: 0;
    }

    .department-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--ll-text-primary);
    }

    .department-stats {
      font-size: 11px;
      color: var(--ll-text-tertiary);
      margin-top: 2px;
    }

    .department-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--ll-text-secondary);
    }

    .online-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--ll-success);
    }

    .employee-list {
      padding-left: 32px;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .employee-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .employee-item:hover {
      background: var(--ll-bg-tertiary);
    }

    .employee-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
      background: var(--ll-bg-elevated);
      overflow: hidden;
    }

    .employee-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .employee-info {
      flex: 1;
      min-width: 0;
    }

    .employee-name {
      font-size: 12px;
      font-weight: 500;
      color: var(--ll-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .employee-position {
      font-size: 11px;
      color: var(--ll-text-tertiary);
    }

    .employee-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .employee-status.online {
      background: var(--ll-success);
      box-shadow: 0 0 6px var(--ll-success);
    }

    .employee-status.busy {
      background: var(--ll-warning);
    }

    .employee-status.away {
      background: var(--ll-info);
    }

    .employee-status.offline {
      background: var(--ll-text-tertiary);
    }

    .sidebar-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--ll-border);
    }

    .team-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--ll-bg-tertiary);
      border-radius: 8px;
    }

    .summary-item {
      text-align: center;
    }

    .summary-value {
      font-size: 18px;
      font-weight: 700;
      color: var(--ll-accent);
    }

    .summary-label {
      font-size: 10px;
      color: var(--ll-text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 2px;
    }

    /* 折叠状态样式 */
    :host([collapsed]) .sidebar-title,
    :host([collapsed]) .search-box,
    :host([collapsed]) .department-info,
    :host([collapsed]) .employee-list,
    :host([collapsed]) .department-count,
    :host([collapsed]) .sidebar-footer {
      display: none;
    }

    :host([collapsed]) .department-header {
      justify-content: center;
      padding: 12px;
    }

    :host([collapsed]) .expand-icon {
      display: none;
    }

    :host([collapsed]) .department-icon {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }

    .empty-state {
      padding: 32px 16px;
      text-align: center;
      color: var(--ll-text-tertiary);
    }

    .empty-icon {
      font-size: 32px;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 12px;
    }
  `;

  private getDepartmentStats(dept: Department): DepartmentStats {
    const deptEmployees = this.employees.filter(e => e.department === dept);
    return {
      total: deptEmployees.length,
      online: deptEmployees.filter(e => e.status === 'online').length,
      busy: deptEmployees.filter(e => e.status === 'busy').length
    };
  }

  private getFilteredEmployees(dept: Department): Employee[] {
    return this.employees
      .filter(e => e.department === dept)
      .filter(e => {
        if (!this.searchQuery) return true;
        const query = this.searchQuery.toLowerCase();
        return e.name.toLowerCase().includes(query) ||
               e.position.toLowerCase().includes(query);
      })
      .sort((a, b) => b.level - a.level);
  }

  private toggleDepartment(dept: Department): void {
    const newExpanded = new Set(this.expandedDepartments);
    if (newExpanded.has(dept)) {
      newExpanded.delete(dept);
    } else {
      newExpanded.add(dept);
    }
    this.expandedDepartments = newExpanded;
  }

  private selectDepartment(dept: Department): void {
    this.selectedDepartment = this.selectedDepartment === dept ? null : dept;
    this.dispatchEvent(new CustomEvent('department-select', {
      detail: { department: this.selectedDepartment },
      bubbles: true,
      composed: true
    }));
  }

  private selectEmployee(employee: Employee): void {
    this.dispatchEvent(new CustomEvent('employee-select', {
      detail: { employee },
      bubbles: true,
      composed: true
    }));
  }

  private toggleCollapse(): void {
    this.dispatchEvent(new CustomEvent('toggle-collapse', {
      bubbles: true,
      composed: true
    }));
  }

  private getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  override render() {
    const departments = Object.values(Department);
    const totalEmployees = this.employees.length;
    const onlineEmployees = this.employees.filter(e => e.status === 'online').length;

    return html`
      <div class="sidebar-header">
        ${!this.collapsed ? html`
          <span class="sidebar-title">组织架构</span>
        ` : null}
        <button class="collapse-btn" @click=${this.toggleCollapse}>
          ${this.collapsed ? '→' : '←'}
        </button>
      </div>

      ${!this.collapsed ? html`
        <div class="search-box">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              class="search-input"
              type="text"
              placeholder="搜索成员..."
              .value=${this.searchQuery}
              @input=${(e: InputEvent) => this.searchQuery = (e.target as HTMLInputElement).value}
            >
          </div>
        </div>
      ` : null}

      <div class="department-list">
        ${departments.map(dept => {
          const config = DEPARTMENT_CONFIG[dept];
          const stats = this.getDepartmentStats(dept);
          const isExpanded = this.expandedDepartments.has(dept);
          const isActive = this.selectedDepartment === dept;
          const filteredEmployees = this.getFilteredEmployees(dept);

          if (this.searchQuery && filteredEmployees.length === 0) {
            return null;
          }

          return html`
            <div class="department-item">
              <div 
                class="department-header ${isActive ? 'active' : ''}"
                @click=${() => this.selectDepartment(dept)}
              >
                ${!this.collapsed ? html`
                  <span class="expand-icon ${isExpanded ? 'expanded' : ''}" 
                        @click=${(e: Event) => { e.stopPropagation(); this.toggleDepartment(dept); }}>
                    ▶
                  </span>
                ` : null}
                <div class="department-icon" style="background: ${config.color}20; color: ${config.color}">
                  ${config.icon}
                </div>
                ${!this.collapsed ? html`
                  <div class="department-info">
                    <div class="department-name">${config.name}</div>
                    <div class="department-stats">
                      ${stats.online} 在线 / ${stats.total} 人
                    </div>
                  </div>
                  <div class="department-count">
                    ${stats.online > 0 ? html`<span class="online-dot"></span>` : null}
                    ${stats.total}
                  </div>
                ` : null}
              </div>

              ${!this.collapsed && isExpanded ? html`
                <div class="employee-list">
                  ${filteredEmployees.length === 0 ? html`
                    <div class="empty-state">
                      <div class="empty-text">暂无成员</div>
                    </div>
                  ` : filteredEmployees.map(emp => html`
                    <div class="employee-item" @click=${() => this.selectEmployee(emp)}>
                      <div class="employee-avatar">
                        ${emp.avatar 
                          ? html`<img src="${emp.avatar}" alt="${emp.name}">`
                          : this.getInitials(emp.name)
                        }
                      </div>
                      <div class="employee-info">
                        <div class="employee-name">${emp.name}</div>
                        <div class="employee-position">${emp.position}</div>
                      </div>
                      <span class="employee-status ${emp.status}"></span>
                    </div>
                  `)}
                </div>
              ` : null}
            </div>
          `;
        })}
      </div>

      ${!this.collapsed ? html`
        <div class="sidebar-footer">
          <div class="team-summary">
            <div class="summary-item">
              <div class="summary-value">${totalEmployees}</div>
              <div class="summary-label">总人数</div>
            </div>
            <div class="summary-item">
              <div class="summary-value" style="color: var(--ll-success)">${onlineEmployees}</div>
              <div class="summary-label">在线</div>
            </div>
            <div class="summary-item">
              <div class="summary-value" style="color: var(--ll-warning)">${totalEmployees - onlineEmployees}</div>
              <div class="summary-label">离线</div>
            </div>
          </div>
        </div>
      ` : null}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'linglong-sidebar': LinglongSidebar;
  }
}
