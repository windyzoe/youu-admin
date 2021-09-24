import React, { PureComponent } from 'react';
import { Skeleton, Space } from 'antd';
import BulletLine from '@/components/BulletLine';
import IconPro from '@/components/IconPro';
import styles from './index.less';

/**
 *CSS实现的loading画面
 *
 * @class SquareLoading
 * @extends {PureComponent}
 */
class PageLoading extends PureComponent {
  render() {
    return (
      <div className={styles.preloader}>
        <div />
      </div>
    );
  }
}
export const StaticLoading = () => (
  <div style={{ padding: '2%' }}>
    <Space>
      <Skeleton.Avatar />
      <Skeleton.Input style={{ width: 200 }} />
      <Skeleton.Input style={{ width: 200 }} />
      <Skeleton.Input style={{ width: 200 }} />
      <Skeleton.Input style={{ width: 200 }} />
      <Skeleton.Input style={{ width: 200 }} />
      <Skeleton.Button />
      <Skeleton.Button />
    </Space>
    <br />
    <br />
    <Skeleton paragraph={{ rows: 8 }} />
  </div>
);
export default PageLoading;
