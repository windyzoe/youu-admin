import React from 'react';
import { Layout } from 'antd';
import moment from 'moment';

const { Footer } = Layout;

// 全局页脚
export default () => {
  return <Footer style={{ textAlign: 'center' }}>{`${moment().format('YYYY')} YOUUI Zac's Product`}</Footer>;
};
