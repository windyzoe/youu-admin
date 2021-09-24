import React from 'react';
import { SlackOutlined } from '@ant-design/icons';
import styles from './index.less';

/**
 * @description 当前网站的logo
 * @date 2020-11-13
 * @param { hiddenTitle } 是否隐藏logo
 * @returns
 */
export default function Logo({ hiddenTitle }) {
  return (
    <div className={styles.root}>
      <SlackOutlined />
      {!hiddenTitle && <div style={{ textIndent: '1rem', letterSpacing: '0.15rem' }}>YOUUUI</div>}
    </div>
  );
}
