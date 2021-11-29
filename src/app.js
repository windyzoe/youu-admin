import dva from 'dva';
import { createHashHistory } from 'history';
// import { createBrowserHistory } from 'history';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.less';
// 全量引入antd样式,局部引入无意义可能会有坑
import 'antd/dist/antd.variable.less';

// 0.2---moment国际化配置;
moment.locale('zh-cn');

// 1. Initialize
const app = dva({
  history: createHashHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

export function renderDvaRoot() {
  // 5. Start
  app.start('#root');
}

export function getDvaApp() {
  return app;
}

/** 把store暴露出来
 * @author Zachary.X
 * @date 2020-12-29
 * @returns redux store
 */
export function getStore() {
  // eslint-disable-next-line no-underscore-dangle
  return app._store;
}
