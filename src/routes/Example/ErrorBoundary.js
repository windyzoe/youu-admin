// eslint-disable-next-line max-classes-per-file
import React from 'react';
import { Row, Col, Result, Card } from 'antd';
import BasicContentLayout from '@/layouts/BasicContentLayout';
import ErrorBoundaryWraper, { withErrorBoundary } from '@/components/ErrorBoundary';
import ErrorItem from '@/components/ErrorBoundary/ErrorItem';

/**错误边界
 * @description 包裹住可能会出错的组件
 * @date 2020-11-09
 * @class ErrorBoundary
 */
export default class ErrorBoundary extends React.PureComponent {
  render() {
    return (
      <BasicContentLayout>
        <Row>
          <Col span={8}>
            <Result status="success" title="REACT报错,防白屏" />
          </Col>
          <Col span={8}>
            <Card title="父级errorBoundary包裹">
              <ErrorBoundaryWraper>
                <ErrorItem />
              </ErrorBoundaryWraper>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="装饰器方式包裹组件">
              <ErrorItemHOC />
            </Card>
          </Col>
        </Row>
      </BasicContentLayout>
    );
  }
}

@withErrorBoundary
class ErrorItemHOC extends React.Component {

  render() {
    // 你可以自定义降级后的 UI 并渲染
    return <ErrorItem />;
  }
}
