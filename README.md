# 🐉 灵笼看板 (Linglong Dashboard)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/linglong-group/linglong-dashboard)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Lit](https://img.shields.io/badge/lit-3.1.0-324fff.svg)](https://lit.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3.0-blue.svg)](https://www.typescriptlang.org/)

> 灵笼集团 OpenClaw 看板系统 - 为19人团队定制的组织架构可视化工具

![Dashboard Preview](docs/screenshots/dashboard-preview.png)

## ✨ 特性

- 🏢 **组织架构可视化** - 直观展示灵笼集团19人团队结构
- 📊 **任务看板** - 类似 Trello 的拖拽式任务管理
- 📈 **实时监控** - Gateway 连接状态、系统健康度监控
- 🎨 **现代化UI** - 基于 Lit + TypeScript 的响应式设计
- 🔌 **WebSocket 实时通信** - 即时更新团队动态
- 📱 **响应式布局** - 支持桌面端、平板和移动端

## 🚀 快速开始

### 在线演示

👉 [https://linglong-group.github.io/linglong-dashboard](https://linglong-group.github.io/linglong-dashboard)

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/linglong-group/linglong-dashboard.git
cd linglong-dashboard

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 部署到生产环境

```bash
# 构建
npm run build

# 预览生产构建
npm run preview
```

## 📁 项目结构

```
linglong-dashboard/
├── src/
│   ├── components/          # Lit 组件
│   │   ├── linglong-dashboard.ts
│   │   ├── linglong-header.ts
│   │   └── linglong-sidebar.ts
│   ├── services/            # 服务层
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── types/               # TypeScript 类型
│   │   └── index.ts
│   ├── styles/              # CSS 主题
│   │   └── theme.css
│   └── main.ts              # 应用入口
├── docs/                    # 文档
├── index.html               # HTML 入口
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖
```

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Lit](https://lit.dev/) | 3.1.0 | Web Components 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.3.0 | 类型安全 |
| [Vite](https://vitejs.dev/) | 5.0.0 | 构建工具 |
| WebSocket | - | 实时通信 |

## 📊 功能模块

### 组织架构 (Organization)

展示灵笼集团19人团队的组织结构：

```
灵笼集团 (OpenClaw Group)
├── 集团办公室 (灵枢-P9 主任)
├── 市场部 (灵市-P8 总监)
│   ├── 灵搜-P6 (信息检索)
│   ├── 灵研-P6 (用户研究)
│   └── ...
├── 开发部 (灵码-P8 总监)
│   ├── 灵构-P8 (架构师)
│   ├── 灵云-P6 (云架构)
│   └── ...
├── 运营部 (灵运-P7 总监)
├── 安全部 (灵盾-P8 总监)
└── 宣传部 (灵宣-P7 总监)
```

### 任务看板 (Kanban)

- 四列看板：待办 / 进行中 / 审核中 / 已完成
- 优先级标签：P0(紧急) / P1(高) / P2(中) / P3(低)
- 负责人头像显示
- 截止时间提醒

### 实时监控 (Monitor)

- Gateway 健康状态
- 数据库连接状态
- WebSocket 连接状态
- Agent 运行状态
- 在线用户数统计

## 🔌 API 接口

### WebSocket 连接

```typescript
const ws = new WebSocket('ws://127.0.0.1:18789/ws');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // 处理消息
};
```

### 消息类型

| 类型 | 描述 |
|------|------|
| `task_update` | 任务更新 |
| `employee_update` | 员工状态更新 |
| `system_status` | 系统状态更新 |
| `notification` | 通知消息 |

## 📝 配置说明

### Vite 配置

```typescript
// vite.config.ts
export default {
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:18789',
      '/ws': 'ws://127.0.0.1:18789'
    }
  }
};
```

### 主题变量

```css
:root {
  --ll-primary: #1a365d;
  --ll-accent: #ed8936;
  --ll-success: #48bb78;
  --ll-warning: #ecc94b;
  --ll-error: #f56565;
}
```

## 🧪 测试

```bash
# 运行类型检查
npm run type-check

# 运行 ESLint
npm run lint
```

## 📦 构建输出

构建后的文件位于 `dist/` 目录：

```
dist/
├── index.html
├── assets/
│   ├── linglong-dashboard.js
│   ├── linglong-dashboard.css
│   └── ...
└── favicon.svg
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

## 🙏 致谢

- [Lit](https://lit.dev/) - 优秀的 Web Components 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [OpenClaw](https://github.com/OpenClaw) - 灵笼集团的核心技术支撑

## 📞 联系我们

- 项目主页: https://github.com/linglong-group/linglong-dashboard
- 问题反馈: https://github.com/linglong-group/linglong-dashboard/issues
- 邮箱: dev@linglong.group

---

<p align="center">
  Made with ❤️ by 灵笼集团开发部
</p>
