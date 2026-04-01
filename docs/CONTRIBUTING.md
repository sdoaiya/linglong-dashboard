# 贡献指南

感谢您对灵笼看板项目的关注！我们欢迎所有形式的贡献。

## 🚀 快速开始

1. Fork 本仓库
2. 克隆您的 Fork
```bash
git clone https://github.com/YOUR_USERNAME/linglong-dashboard.git
cd linglong-dashboard
```

3. 安装依赖
```bash
npm install
```

4. 启动开发服务器
```bash
npm run dev
```

## 📝 提交规范

### Commit Message 格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

#### 示例

```
feat(dashboard): 添加任务拖拽功能

- 实现看板列之间的任务拖拽
- 添加拖拽动画效果
- 更新任务状态到 WebSocket

Closes #123
```

## 🎨 代码规范

### TypeScript

- 使用严格模式 (`strict: true`)
- 所有函数都需要返回类型声明
- 优先使用 `const` 和 `let`，避免 `var`
- 使用可选链操作符 (`?.`) 和空值合并运算符 (`??`)

### CSS

- 使用 CSS 变量定义主题颜色
- BEM 命名规范
- 避免使用 `!important`

### Lit 组件

```typescript
@customElement('ll-example')
export class Example extends LitElement {
  @property() label = 'Default';
  @state() private _count = 0;

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<button>${this.label}</button>`;
  }
}
```

## 🧪 测试

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 📋 Pull Request 流程

1. 创建新分支
```bash
git checkout -b feature/my-feature
```

2. 提交更改
```bash
git commit -m "feat: 添加新功能"
```

3. 推送到远程
```bash
git push origin feature/my-feature
```

4. 创建 Pull Request
   - 填写清晰的标题和描述
   - 关联相关的 Issue
   - 确保 CI 检查通过

## 🐛 报告 Bug

提交 Issue 时请包含：

1. 问题描述
2. 复现步骤
3. 期望结果
4. 实际结果
5. 环境信息（浏览器、操作系统等）
6. 截图（如有）

## 💡 功能建议

提交功能建议时请包含：

1. 功能描述
2. 使用场景
3. 可能的实现方案
4. 是否愿意贡献代码

## 📞 联系方式

- Issue: https://github.com/linglong-group/linglong-dashboard/issues
- 讨论区: https://github.com/linglong-group/linglong-dashboard/discussions
- 邮箱: dev@linglong.group

## 🙏 感谢

感谢所有贡献者！
