import React, { PureComponent } from 'react';
import { Menu, Popover } from 'antd';
import { pathToRegexp } from 'path-to-regexp';
import { Link, withRouter } from 'dva/router';
import classNames from 'classnames';
import IconPro from '@/components/IconPro';
import { urlToList } from '../_utils/pathTools';

const { SubMenu } = Menu;

//   三类展示方式
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  // return null;
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0) {
      return <img src={icon} alt="icon" />;
    }
    return <IconPro type={icon} style={{ fontSize: 18 }} />;
  }

  return icon;
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => [path,path2]
 * @param  menu
 */
export const getFlatMenuKeys = (menu) =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce((matchKeys, path) => matchKeys.concat(flatMenuKeys.filter((item) => pathToRegexp(item).test(path))), []);

class GlobalMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
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
    const openKeys = getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
    return openKeys;
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * @memberof SiderMenu
   */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location } = this.props;
    return (
      <Link to={itemPath} target={target} replace={itemPath === location.pathname}>
        {icon}
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
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                <span>{item.name}</span>
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
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
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
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

  isMainMenu = (key) => {
    const { menuData } = this.props;
    return menuData.some((item) => key && (item.key === key || item.path === key));
  };

  handleOpenChange = (openKeys) => {
    const { collapsed } = this.props;
    // collapsed 不需要设置Openkey,为啥antd4要在闭合的时候调用Openkeychange啊
    if (collapsed) return;
    const lastOpenKey = openKeys[openKeys.length - 1];
    // 如果一级菜单的数量大于1,那么就直接用lastOpenkey
    const moreThanOne = openKeys.filter((openKey) => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  };

  render() {
    const { menuData } = this.props;
    const { openKeys } = this.state;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Menu key="Menu" mode="horizontal" onOpenChange={this.handleOpenChange} selectedKeys={selectedKeys}>
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}

export default withRouter(GlobalMenu);
