import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { getLocalStore } from '../utils/localStore';
import { reloadAuthorized } from '../utils/Authorized';

// 全局modal，早于router加载
export default {
  namespace: 'global',

  state: {
    // 侧边菜单收缩
    collapsed: false,
    // 布局
    layout: getLocalStore('layout') ?? 'sider',
    // 是否用tab来切换页面
    tabPage: true,
  },

  effects: {
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select((state) => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        // 全局监听网址变更事件
        console.log(pathname, search);
      });
    },
  },
};
