/* eslint-disable no-underscore-dangle */
import React from 'react';
import Tabs from 'rc-tabs';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';
import './index.css';
import _, { isBuffer } from 'lodash';

const renderTabBar = (props, DefaultTabBar) => {
  return (
    <DefaultTabBar {...props}>
      {(Node) => {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{Node}</>;
      }}
    </DefaultTabBar>
  );
  // return (
  //   <div style={{ display: 'flex', marginBottom: 16 }}>
  //     {props.panes.map((pane) => {
  //       const {
  //         key,
  //         props: { tab },
  //       } = pane;
  //       return (
  //         <div key={key} style={{ padding: 16 }}>
  //           {tab}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
};

/**
 * @description 根tabRouter,用于管控整个tab
 * @author Zachary.X
 * @date 2020-12-14
 * @class TabsRouter
 * @todo 重定向
 */
@withRouter
export default class TabsRouter extends React.Component {
  static propTypes = {
    noFoundURL: PropTypes.string,
    noFoundRender: PropTypes.element,
  };

  state = {
    activePathkey: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      liveTabs: [],
    };
    this._isMounted = false;
    this._pendingLocation = null;
    this.unlisten = props.history.listen((location) => {
      if (this._isMounted) {
        this.historyLocationListener(location);
      } else {
        this._pendingLocation = location;
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._pendingLocation) {
      this.historyLocationListener(this._pendingLocation);
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  }

  urlChange = (pathname) => {
    this.getHistory().push(pathname);
  };

  handleTabRouterChange = (pathkey) => {
    const { liveTabs } = this.state;
    const tab = liveTabs.find((v) => v.pathkey === pathkey);
    this.urlChange(this.getLiveTabUrl(tab));
  };

  historyLocationListener = (location) => {
    const { liveTabs } = this.state;
    const { noFoundRender, noFoundURL, history } = this.props;
    const match = this.getLocationMatch(location);
    // 0-- 重定向的匹配
    if (match && match.to) {
      history.push(match.to);
      return;
    }
    // 1-- 有匹配的router
    if (match) {
      const matchLiveTab = liveTabs.find((v) => v.pathkey === match.pathkey);
      // 1.1-- 在当前tabs里没有
      if (!matchLiveTab) {
        this.setState({ liveTabs: [...liveTabs, { ...location, ...match, match }] });
        // 1.2-- 有,但是search改变也要刷新,于是更新search
      } else if (matchLiveTab.search !== location.search) {
        matchLiveTab.search = location.search;
        matchLiveTab.match = match;
        this.setState({ liveTabs: [...liveTabs] });
      }
      // 1.3 切一波key
      this.setState({ activePathkey: match.pathkey });
      // 2-- 找不到的渲染
    } else if (noFoundRender) {
      this.setState({ liveTabs: [] });
      // 3-- 找不到的跳转
    } else if (noFoundURL) {
      this.urlChange(noFoundURL);
    }
  };

  // 拿到location的match,找到匹配的tabrouter或者redirect
  getLocationMatch = (location) => {
    const { children } = this.props;
    const { pathname } = location;
    let match;
    React.Children.forEach(children, (element, index) => {
      if (React.isValidElement(element)) {
        // 适配重定向from和tabrouter
        const { path, to, from } = element.props;
        const matchObject = matchPath(pathname, { path: path || from, exact: true, strict: true });
        if (matchObject) {
          match = { ...matchObject, pathkey: matchObject.path, to };
        }
      }
    });
    return match;
  };

  closeAll = () => {
    const { liveTabs, activePathkey } = this.state;
    const matchLiveTab = liveTabs.find((v) => v.pathkey === activePathkey);
    this.setState({ liveTabs: [matchLiveTab] });
  };

  getHistory = () => {
    return _.get(this, 'props.history');
  };

  getLocation = () => {
    return _.get(this, 'props.location');
  };

  getLiveTabUrl = (liveTab) => {
    return `${liveTab.pathname}${liveTab.search}`;
  };

  // tab页的操作设置
  getTabEditConfig = () => {
    const { liveTabs } = this.state;
    return {
      showAdd: false,
      onEdit: (type, info) => {
        const { key: pathkey } = info;
        if (liveTabs.length === 1) return;
        let index;
        const newLiveTabs = liveTabs.filter((v, indexv) => {
          if (v.pathkey === pathkey) {
            index = indexv;
          }
          return v.pathkey !== pathkey;
        });
        // 1 删除tab
        this.setState({
          liveTabs: newLiveTabs,
        });
        // 2 如果关闭当前,跳转到临近的tab,先找左边再找右边
        if (pathkey === _.get(this.getLocationMatch(this.getLocation()), 'pathkey')) {
          const tab = index > 0 ? newLiveTabs[index - 1] : newLiveTabs[index];
          this.urlChange(this.getLiveTabUrl(tab));
        }
      },
    };
  };

  renderTabBarExtraContent = () => {
    const { tabBarExtraContent } = this.props;
    const { liveTabs, activePathkey } = this.state;
    if (_.isFunction(tabBarExtraContent)) {
      return tabBarExtraContent(liveTabs, activePathkey, this.setState);
    }
    return (
      <div style={{ cursor: 'pointer', height: '100%', padding: '0px 12px 0 0' }} onClick={this.closeAll}>
        关闭其他
      </div>
    );
  };

  render() {
    const {
      children,
      prefixCls,
      noFoundURL,
      noFoundRender,
      className,
      staticContext,
      history,
      location,
      match,
      tabBarGutter = 4,
      ...rest
    } = this.props;
    const { liveTabs, activePathkey } = this.state;
    const liveTabChildren = [];
    let defaultChild;
    // 页面和tab的互相匹配,展示顺序按liveTabs来
    if (React.Children.count(children) !== 0) {
      React.Children.forEach(children, (el, index) => {
        if (React.isValidElement(el)) {
          const { path: pathkey } = el.props;
          if (index === 0) {
            defaultChild = el;
          }
          const indexTab = _.findIndex(liveTabs, (v) => v.pathkey === pathkey);
          if (indexTab > -1) {
            liveTabChildren[indexTab] = {
              tabRouter: liveTabs[indexTab],
              elememt: el,
            };
          }
        }
      });
    }
    // 如果没有,就搞个默认值,目前觉得没用
    if (liveTabChildren.length === 0 && noFoundRender) return noFoundRender;
    return (
      <div className={className}>
        <Tabs
          prefixCls={prefixCls}
          onChange={this.handleTabRouterChange}
          renderTabBar={renderTabBar}
          activeKey={activePathkey}
          editable={this.getTabEditConfig()}
          tabBarGutter={tabBarGutter}
          tabBarExtraContent={this.renderTabBarExtraContent()}
          {...rest}
        >
          {liveTabChildren.map((v) =>
            React.cloneElement(v.elememt, {
              match: v.tabRouter.match,
              search: v.tabRouter.search,
              pathkey: v.tabRouter.pathkey,
            })
          )}
        </Tabs>
      </div>
    );
  }
}
