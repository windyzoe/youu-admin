import React from 'react';
import { Result } from 'antd';
import errorImg from '@/assets/statusImg/渲染失败.svg';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  // 更新 state 使下一次渲染能够显示降级后的 UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 将错误日志上报给服务器
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // 自定义降级后的 UI 并渲染
      return (
        <Result
          title="OOPS,渲染失败了!"
          subTitle="网页渲染出错了,请联系系统负责人."
          icon={<img src={errorImg} style={{ width: '50%', maxWidth: 460 }} alt="渲染失败" />}
        />
      );
    }
    return children;
  }
}

/**
 * 装饰器写法
 * @param Component 业务组件
 */
export function withErrorBoundary(Component) {
  const Wrapped = (props) => {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // DevTools 显示的组件名
  const name = Component.displayName || Component.name || 'Unknown';
  Wrapped.displayName = `withErrorBoundary(${name})`;

  return Wrapped;
}
