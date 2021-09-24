import React from 'react';
import { Result } from 'antd';

export default class ErrorItem extends React.Component {
  state = { hasError: false };

  componentDidMount() {
    const e = new Error('哎呦,错了');
    throw e;
  }

  render() {
    const { hasError } = this.state;
    // 你可以自定义降级后的 UI 并渲染
    return <Result title="正常的展示" status="success" />;
  }
}
