import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'dva/router';
import { getMenuMatchKeys } from '@/common/menu';
import IconPro from '@/components/IconPro';

const { SubMenu } = Menu;

//   三类展示方式
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0) {
      return <img src={icon} alt="icon" />;
    }
    return <IconPro type={icon} style={{ fontSize: 16 }} />;
  }
  return icon;
};

class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props), //openkeys 当前打开的menukey链条
    };
  }

  // 监听path和闭合状态来判断menu的弹出
  componentDidUpdate(prevProps) {
    const { location, collapsed } = this.props;
    // 1--path变化,并且不是闭合状态
    if (prevProps.location.pathname !== location.pathname && collapsed === false) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(this.props),
      });
    }
    // 2--打开状态时,再次确认openKeys
    if (prevProps.collapsed === true && collapsed === false) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(this.props),
      });
    }
  }

  /**
   * 从pathName拿OpenKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus(props) {
    const {
      location: { pathname },
    } = props || this.props;
    const openKeys = getMenuMatchKeys(pathname);
    return openKeys;
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * @memberof SiderMenu
   */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          <span>{name}</span>
        </a>
      );
    }
    const { location } = this.props;
    return (
      <Link to={itemPath} target={target} replace={itemPath === location.pathname}>
        <span>{name}</span>
      </Link>
    );
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    if (item.children && item.children.some((child) => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu icon={item.icon ? getIcon(item.icon) : null} title={<span>{item.name}</span>} key={item.path}>
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return (
        <Menu.Item key={item.path} icon={item.icon ? getIcon(item.icon) : null}>
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );
    }
  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter((item) => item.name && !item.hideInMenu)
      .map((item) => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.isEnable, ItemDom);
      })
      .filter((item) => item);
  };

  // 获取当前的路径的menuKey
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    return getMenuMatchKeys(pathname);
  };

  // 转化路径
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };

  // 权限检查
  checkPermissionItem = (isEnable, ItemDom) => {
    if (isEnable === 0) {
      return false;
    }
    return ItemDom;
  };

  /**
   * 判断menukey是不是一级的
   * @param {string} key menukey,一般是path
   * @returns
   */
  isFirstMenu = (key) => {
    const { menuData } = this.props;
    return menuData.some((item) => key && (item.key === key || item.path === key));
  };

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    // 如果一级菜单的数量大于1,那么就直接用lastOpenkey
    const moreThanOne = openKeys.filter((openKey) => this.isFirstMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  };

  render() {
    const { menuData, collapsed } = this.props;
    const { openKeys } = this.state;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Menu
        key="Menu"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={this.handleOpenChange}
        selectedKeys={selectedKeys}
        inlineCollapsed={collapsed}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}

export default withRouter(SiderMenu);
