import './styles/theme.css';
import './components/linglong-dashboard.js';

// 应用初始化
function initApp(): void {
  console.log('🐉 灵笼看板启动中...');
  
  const app = document.getElementById('app');
  if (!app) {
    console.error('找不到 #app 容器');
    return;
  }

  // 清除加载占位符
  app.innerHTML = '';
  
  // 创建主组件
  const dashboard = document.createElement('linglong-dashboard');
  app.appendChild(dashboard);
  
  console.log('✅ 灵笼看板已启动');
}

// 等待 DOM 加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
