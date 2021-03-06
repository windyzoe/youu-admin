import React from 'react';
import PromiseRender from './PromiseRender';
import { CURRENT } from './renderAuthorize';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } ExceptionComponent
 */
const checkPermissions = (authority, currentAuthority, target, ExceptionComponent) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }
  // 数组处理
  if (Array.isArray(authority)) {
    if (authority.indexOf(currentAuthority) >= 0) {
      return target;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return target;
        }
      }
    }
    return ExceptionComponent;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority === currentAuthority) {
      return target;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return target;
        }
      }
    }
    return ExceptionComponent;
  }

  // Promise 处理
  if (isPromise(authority)) {
    return <PromiseRender ok={target} error={ExceptionComponent} promise={authority} />;
  }

  // Function 处理
  if (typeof authority === 'function') {
    const bool = authority(currentAuthority);
    // 函数执行后返回值是 Promise
    if (isPromise(bool)) {
      return <PromiseRender ok={target} error={ExceptionComponent} promise={bool} />;
    }
    if (bool) {
      return target;
    }
    return ExceptionComponent;
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, ExceptionComponent) => {
  return checkPermissions(authority, CURRENT, target, ExceptionComponent);
};

export default check;
