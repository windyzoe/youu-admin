import React, { useMemo } from 'react';
import { Link, withRouter } from 'dva/router';
import { pathToRegexp } from 'path-to-regexp';
import { Breadcrumb } from 'antd';
import { getMenuData, getBreadcrumbNameMap } from '@/common/menu';
import { getRouterData } from '@/common/router';
import { urlToList } from '@/components/_utils/pathTools';
import Icon from '@/components/IconPro';


function getBreadcrumb(breadcrumbNameMap, url) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

export default withRouter((props) => {
  const {
    location: { pathname },
  } = props;
  const breadcrumbNameMap = useMemo(() => getBreadcrumbNameMap(getMenuData(), getRouterData()), []);
  // Convert the url to an array
  const pathSnippets = urlToList(pathname);
  // Loop data mosaic routing
  const extraBreadcrumbItems = pathSnippets.map((url, index) => {
    const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
    const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
    return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
      <Breadcrumb.Item key={url}>
        {isLinkable ? <Link to={url} /> : <span>{currentBreadcrumb.name}</span>}
      </Breadcrumb.Item>
    ) : null;
  });
  return (
    <Breadcrumb style={{ marginLeft: 12, fontSize: '1rem' }} separator=">">
      <Breadcrumb.Item>
        <Link to="/">
          <Icon type="icon-shouye" style={{ marginRight: 2 }} />
          首页
        </Link>
      </Breadcrumb.Item>
      {extraBreadcrumbItems}
    </Breadcrumb>
  );
});
