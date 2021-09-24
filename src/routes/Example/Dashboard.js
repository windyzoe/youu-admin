import React, { useEffect, useState } from 'react';
import { Col, Row, notification } from 'antd';
import { Link } from 'dva/router';
import { useHistory } from 'react-router-dom';
import IconPro from '@/components/IconPro';
import { useGlobalData } from '@/components/StoreContext';
import MaterialCard from '@/components/MaterialCard';
import CSSAnimate from '@/components/CSSAnimate';
import LineChart from '@/components/Charts/LineChart';
import PieChart from '@/components/Charts/PieChart';

export default function Dashboard() {
  const history = useHistory();
  const {
    state: { color },
    dispatch,
  } = useGlobalData();
  return (
    <Row gutter={24}>
      <Col span={16}>
        <MaterialCard header={<div>折线图堆叠</div>} headColor="Geekblue">
          <LineChart />
        </MaterialCard>
      </Col>
      <Col span={8}>
        <MaterialCard header={<div>饼图</div>} headColor="Lime">
          <PieChart />
        </MaterialCard>
      </Col>
      <Col span={16}>
        <MaterialCard header={<div>项目概览</div>}>
          <a href="mailto:sample@163.com?subject=test&cc=sample@hotmail.com&body=第一行%0d%0a第二行">点击发送邮件</a>
          <br />
          <a onClick={() => history.push('/example/user?search=sssdasd')}>跳转测试</a>
          <br />
          <Link to="/example/detail/12344">跳转详情</Link>
        </MaterialCard>
      </Col>
      <Col span={8}>
        <MaterialCard header={<div>动画</div>} headColor="Gold">
          <CSSAnimate type="flipOutX" style={{ position: 'relative', fontSize: '4em', textAlign: 'center' }}>
            <strong>Animate</strong> Me<strong>!</strong>
          </CSSAnimate>
        </MaterialCard>
      </Col>
      <Col span={12}>
        <MaterialCard header={<div>图标</div>} headColor="Cyan">
          使用<a href="https://www.iconfont.cn/">ICONFONT</a>
          <IconPro type="icon-zhuangsetubiao-12" />
        </MaterialCard>
      </Col>
      <Col span={12}>
        <MaterialCard header={<div>context useReducer 实现的极简redux,注意没有选择性更新</div>} headColor="Cyan">
          <a
            style={{ color }}
            onClick={() => dispatch({ type: 'changeData', payload: { color: color === 'red' ? 'green' : 'red' } })}
          >
            {color}
          </a>
        </MaterialCard>
      </Col>
    </Row>
  );
}
