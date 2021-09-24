import React from 'react';
import { Layout } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import Logo from '@/components/Logo';
import GlobalFooter from '@/components/GlobalFooter';
import GlobalHeader from '@/components/GlobalHeader';
import SiderMenu from '@/components/GlobalMenu/SiderMenu';
import { getStore } from '@/app';
import styles from '@/layouts/BasicLayout.less';
import bgImg from '@/assets/menu.jpg';

const { Header, Content, Footer, Sider } = Layout;
const collapsedWidth = 80;
const siderWidth = 200;
/**
 * @description 默认的收缩宽度是80,200
 * @author 013203-徐泽瀚
 * @date 2020-11-13
 * @param {*} { children, collapsed }
 */
export default function SiderLayout({ children, collapsed, menuData }) {
  return (
    <Layout className={styles.siderLayout}>
      <aside className={styles.sider} style={{ width: collapsed ? collapsedWidth : siderWidth }}>
        <div className={styles.logo}>
          <Logo hiddenTitle={collapsed} />
        </div>
        <div className={styles.menu}>
          <SiderMenu menuData={menuData} collapsed={collapsed} />
        </div>
        <div
          className={styles.siderTrigger}
          onClick={() => getStore().dispatch({ type: 'global/saveData', payload: { collapsed: !collapsed } })}
        >
          {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </div>
        <div className={styles.menuBgImg} style={{ backgroundImage: `url(${bgImg})` }} />
      </aside>
      <Layout style={{ minHeight: '100vh', marginLeft: collapsed ? collapsedWidth : siderWidth }}>
        <Header style={{ padding: 0, background: 'transparent', height: 48, lineHeight: 48 }}>
          <GlobalHeader />
        </Header>
        <Content style={{ margin: '4px 16px 4px', overflow: 'initial' }}>{children}</Content>
        <GlobalFooter />
      </Layout>
    </Layout>
  );
}
