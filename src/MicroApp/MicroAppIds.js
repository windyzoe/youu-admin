import React from 'react';
import startMicroApps from '@/MicroApp/startMicroApp';

/**
 * @description 专门用来暴露微应用的容器div,加载完成会再启动qiankun
 * @author Zachary.X
 * @date 2021-01-20
 * @class
 */
export default class extends React.Component {
  componentDidMount() {
    const { userProps } = this.props;
    startMicroApps(userProps);
  }

  render() {
    return (
      <>
        <div id="myApp1" />
      </>
    );
  }
}
