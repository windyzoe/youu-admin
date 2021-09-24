/* eslint-disable react/no-children-prop */
import React from 'react';
import { TabPane } from 'rc-tabs';

/** 单个tab路由页面
 * @description 在这一层主要做渲染的优化,非激活的tab不要渲染
 * @author Zachary.X
 * @date 2020-12-14
 * @class TabRoute
 */
export default class TabRoute extends React.Component {
  state = {
    loading: false,
  };

  // 强行控制一波,显示变化的时候再刷新
  shouldComponentUpdate(nextProps, nextState) {
    const { active, search } = this.props;
    const { loading } = this.state;
    return active !== nextProps.active || search !== nextProps.search || loading !== nextState.loading;
  }

  componentDidUpdate(prevProps, prevState) {
    // 对比search如果search不同,通过loading做个卸载加载操作
    const { search } = this.props;
    const { loading } = this.state;
    if (search !== prevProps.search) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ loading: true });
    }
    if (loading) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ loading: false });
    }
  }

  render() {
    const { component: Component, render, className, style, tab, active, id, match, ...rest } = this.props;
    const { loading } = this.state;
    return (
      <TabPane active={active} {...rest} className="tabRoute" style={style}>
        {loading ? null : React.createElement(Component, { match })}
      </TabPane>
    );
  }
}
