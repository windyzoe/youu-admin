import React from 'react';
import intl from 'react-intl-universal';
import { Input, Popover, Menu, Dropdown } from 'antd';
import { useSelector } from 'dva';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import IconPro from '@/components/IconPro';
import Breadcrumb from '@/components/Breadcrumb';
import { changeLocale, SUPPOER_LOCALES, getCurrentLocale } from '@/i18n';
import { logout } from '@/services/user';
import { getCurrentUser, getAuthority } from '@/utils/authority';
import { setLocalStore } from '@/utils/localStore';
import { getStore } from '@/app';
import styles from './index.less';

// 全局header,主布局的一部分
function GlobalHeader({ left = <Breadcrumb />, right = <HeaderActions />, style }) {
  return (
    <div className={styles.root} style={style}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>
        <div className={styles.content}>
          <Input prefix={<SearchOutlined />} placeholder={intl.get('placeHolder')} bordered={false} />
        </div>
        {right}
      </div>
    </div>
  );
}

const HeaderActions = () => {
  const history = useHistory();
  const handleLogout = () => {
    logout()
      .then((res) => {
        history.push('/user/login');
      })
      .catch(() => {});
  };
  const menu = (
    <Menu selectedKeys={useSelector((state) => state.global.layout)}>
      <Menu.Item
        key="top"
        onClick={() => {
          setLocalStore('layout', 'top');
          getStore().dispatch({ type: 'global/saveData', payload: { layout: 'top' } });
        }}
      >
        顶栏布局
      </Menu.Item>
      <Menu.Item
        key="sider"
        onClick={() => {
          setLocalStore('layout', 'sider');
          getStore().dispatch({ type: 'global/saveData', payload: { layout: 'sider' } });
        }}
      >
        侧栏布局
      </Menu.Item>
    </Menu>
  );
  const localeMenu = (
    <Menu selectedKeys={[getCurrentLocale()]}>
      {SUPPOER_LOCALES.map((v) => (
        <Menu.Item key={v.value} onClick={() => changeLocale(v.value)}>
          {v.name}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      <Dropdown overlay={menu}>
        <ActionItem>
          <IconPro type="icon-wangye" />
        </ActionItem>
      </Dropdown>
      <ActionItem>
        <IconPro type="icon-tixing" />
      </ActionItem>
      <Dropdown overlay={localeMenu}>
        <ActionItem>
          <IconPro type="icon-translate" />
        </ActionItem>
      </Dropdown>
      <UserPopCard>
        <ActionItem>
          <IconPro type="icon-geren" />
        </ActionItem>
      </UserPopCard>
      <ActionItem onClick={handleLogout}>
        <IconPro type="icon-tuichudenglu" />
      </ActionItem>
    </>
  );
};

const ActionItem = ({ children, className, ...restProps }) => (
  <div className={styles.actionItem} {...restProps}>
    {children}
  </div>
);

const UserPopCard = (props) => {
  const { children } = props;
  const content = (
    <div>
      <div>您好:{getCurrentUser().userName}</div>
      <div>角色:{getAuthority()}</div>
    </div>
  );
  return (
    <Popover placement="bottomLeft" content={content}>
      {children}
    </Popover>
  );
};

export default React.memo(GlobalHeader);
