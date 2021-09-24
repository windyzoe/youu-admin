// 支持ie11的polyfill,暂时不开启,不想支持
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import { renderDvaRoot } from './app';

window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();
  console.log('捕获到异常：', e);
  return true;
});

/**
 * Step1 初始化应用（可选）
 */
renderDvaRoot();
