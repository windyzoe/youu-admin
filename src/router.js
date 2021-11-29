import React from 'react';
import { router, routerRedux } from 'dva';
import { ConfigProvider } from 'antd';
import { initI18n, getAntdLocale } from '@/i18n';
import StoreContext from '@/components/StoreContext';
import Authorized from '@/utils/Authorized';
import { routerConfig } from './common/router';
import { themeChanged } from './theme';

const { Route, Switch } = router;
const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

ConfigProvider.config({
  prefixCls: process.env.REACT_APP_NAME,
  theme: themeChanged,
});

class RouterConfigClass extends React.Component {
  state = { isReady: false };

  componentDidMount() {
    initI18n().then(() => this.setState({ isReady: true }));
  }

  render() {
    const { isReady } = this.state;
    if (!isReady) return null;
    const { app, history } = this.props;
    const routerData = routerConfig();
    const UserLogin = routerData['/user/login'].component;
    const BasicLayout = routerData['/'].component;
    return (
      <ConfigProvider locale={getAntdLocale()} prefixCls={process.env.REACT_APP_NAME}>
        <StoreContext>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/user/login" component={UserLogin} />
              <Route path="/" render={props => <BasicLayout {...props} />} />
            </Switch>
          </ConnectedRouter>
        </StoreContext>
      </ConfigProvider>
    );
  }
}

function RouterConfig({ history, app }) {
  return <RouterConfigClass history={history} app={app} />;
}

export default RouterConfig;
