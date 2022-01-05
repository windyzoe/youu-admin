import React from 'react';
import { useMount } from 'ahooks';
import { Layout } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import Logo from '@/components/Logo';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import HorizenMenu from '@/components/GlobalMenu/HorizenMenu';
import { getStore } from '@/app';
import styles from '@/layouts/BasicLayout.less';
import bgImg from '@/assets/menu.jpg';

const { Header, Content, Footer, Sider } = Layout;
/**
 * @description 默认的收缩宽度是80,200
 * @author 013203-徐泽瀚
 * @date 2020-11-13
 * @param {*} { children, collapsed }
 */
export default function TopHeaderLayout({ children, collapsed, menuData }) {
  return (
    <Layout className={styles.topHeaderLayout}>
      <Header style={{ height: '6rem', padding: 0, lineHeight: '3rem', position: 'relative' }} className={styles.header}>
        <div className={styles.menuBgImg} style={{ backgroundImage: `url(${bgImg})` }} />
        <GlobalHeader left={<Logo hiddenTitle={collapsed} />} style={{ height: '3rem', color: '#fff', position: 'relative' }} />
        <div className={styles.menu} style={{ height: '3rem' }}>
          <HorizenMenu menuData={menuData} collapsed={collapsed} />
        </div>
      </Header>
      <Content style={{ margin: '4px 16px 4px', overflow: 'initial' }}>{children}</Content>
      <GlobalFooter />
    </Layout>
  );
}
