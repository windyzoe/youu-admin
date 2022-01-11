import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect, router } from 'dva';
import { BackTop } from 'antd';
import _ from 'lodash';
import { pathToRegexp } from 'path-to-regexp';
import { TabsRouter, TabRoute } from '@/components/TabRouter';
import { StaticLoading } from '@/components/PageLoading';
import Authorized from '@/utils/Authorized';
import { setCurrentUser } from '@/utils/authority';
import { getRouterData } from '@/common/router';
import MicroAppIds from '@/MicroApp/MicroAppIds';
import { getMenu } from '@/services/user';
import SiderLayout from './BasicLayoutTypes/Sider';
import TopHeaderLayout from './BasicLayoutTypes/TopHeader';
import { getRoutes } from '../utils/utils';
import { getMenuData, redirectData } from '../common/menu';
import styles from './BasicLayout.less';

const { AuthorizedRoute, check } = Authorized;
const { Switch, Redirect, Route } = router;

@connect(({ user, global = {} }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  layout: global.layout,
  tabPage: global.tabPage,
}))
export default class BasicLayout extends React.Component {
  state = {
    menuData: [],
    userProps: {},
  };

  componentDidMount() {
    getMenu()
      .then((res) => {
        const menuActionRsp = _.get(res, 'data');
        const menuData = [...menuActionRsp];
        // 在这里初始化menu和路由数据
        getMenuData(menuData);
        getRouterData();
        setCurrentUser({});
        this.setState({ menuData, userProps: {} });
      })
      .catch((e) => console.log('%c e', 'color: red; font-size: 24px;', e));
  }

  getPageTitle() {
    const { location } = this.props;
    let title = 'YouU-Zac Personal Admin Template For React';
    const routerData = getRouterData();
    const { pathname } = location;
    let currRouterData = null;
    // match params path
    for (const key in routerData) {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
        break;
      }
    }
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - YouU`;
    }
    return title;
  }

  render() {
    const { layout, collapsed, tabPage } = this.props;
    const { menuData, userProps } = this.state;
    console.log('%c basicLayoutRender', 'color: red; font-size: 24px;', this.props);
    // 等menu进来了再渲染布局
    if (!Array.isArray(menuData) || menuData.length === 0) {
      return <StaticLoading />;
    }
    const baseRedirect = getBaseRedirect();
    console.log('%c baseRedirect', 'color: red; font-size: 24px;', baseRedirect);
    const LayoutComponent = layout === 'top' ? TopHeaderLayout : SiderLayout;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <LayoutComponent collapsed={collapsed} menuData={getMenuData()}>
          {tabPage ? <LayoutContent baseRedirect={baseRedirect} /> : <LayoutContentNoTabs baseRedirect={baseRedirect} />}
          <MicroAppIds userProps={userProps} />
          <BackTop visibilityHeight={20} style={{ right: '12px' }} />
        </LayoutComponent>
      </DocumentTitle>
    );
  }
}

// 没有标签页的布局
const LayoutContentNoTabs = React.memo(({ baseRedirect }) => {
  return (
    <Switch>
      {redirectData.map((item) => (
        <Redirect key={item.from} exact from={item.from} to={item.to} />
      ))}
      {getRoutes('/', getRouterData()).map((item) => (
        <AuthorizedRoute
          key={item.key}
          path={item.path}
          component={item.component}
          exact={item.exact}
          authority={item.authority}
          redirectPath="/exception/403"
        />
      ))}
      <Redirect exact from="/" to={baseRedirect} />
      <Route render={() => <div>404，当前页面不存在，随风飘去了远方...</div>} />
    </Switch>
  );
});

const LayoutContent = React.memo(({ baseRedirect }) => {
  return (
    <TabsRouter noFoundURL="/exception/todo" prefixCls={`youuui ${process.env.REACT_APP_NAME}-tabs`} className={styles.tabRouter}>
      {redirectData.map((item) => (
        <Redirect key={item.from} exact path={item.from} from={item.from} to={item.to} />
      ))}
      {getRoutes('/', getRouterData()).map((item) => (
        <TabRoute
          key={item.path}
          path={item.path}
          component={item.component}
          exact={item.exact}
          authority={item.authority}
          tab={item.name}
          redirectPath="/exception/403"
        />
      ))}
      <Redirect exact from="/" path="/" to={baseRedirect} />
    </TabsRouter>
  );
});

const getBaseRedirect = () => {
  // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
  const urlParams = new URL(window.location.href);
  const redirect = urlParams.searchParams.get('redirect');
  // Remove the parameters in the url
  if (redirect) {
    urlParams.searchParams.delete('redirect');
    window.history.replaceState(null, 'redirect', urlParams.href);
  } else {
    const routerData = getRouterData();
    // get the first authorized route path in routerData
    const authorizedPath = Object.keys(routerData).find((item) => check(routerData[item].authority, item) && item !== '/');
    return authorizedPath;
  }
  return redirect;
};
