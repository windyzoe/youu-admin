import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import CheckPermissions from './CheckPermissions';

// 1--最基本的权限判断
const Authorized = ({ children, authority, noMatch = null }) => {
  const childrenRender = typeof children === 'undefined' ? null : children;
  return CheckPermissions(authority, childrenRender, noMatch);
};

// 2--路由权限组件,基于Authorized组件实现,如果没有权限就返回无权限
const AuthorizedRoute = ({ component: Component, render, authority, redirectPath, ...rest }) => (
  <Authorized
    authority={authority}
    noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
  >
    <Route {...rest} render={(props) => (Component ? <Component {...props} /> : render(props))} />
  </Authorized>
);

/**
 * 3--注解方式判断
 * authority 支持传入  string ,funtion:()=>boolean|Promise
 * e.g. 'user' 只有user用户能访问
 * e.g. 'user,admin' user和 admin 都能访问
 * e.g. ()=>boolean 返回true能访问,返回false不能访问
 * e.g. Promise  then 能访问   catch不能访问
 * e.g. authority support incoming string, funtion: () => boolean | Promise
 * e.g. 'user' only user user can access
 * e.g. 'user, admin' user and admin can access
 * e.g. () => boolean true to be able to visit, return false can not be accessed
 * e.g. Promise then can not access the visit to catch
 * @param {string | function | Promise} authority
 * @param {ReactNode} error 非必需参数
 */
const withAuthority = (authority, error) => {
  /**
   * conversion into a class
   * 防止传入字符串时找不到staticContext造成报错
   */
  let classError = false;
  if (error) {
    classError = () => error;
  }
  if (!authority) {
    throw new Error('authority is required');
  }
  return function checkAuthority(wrappedComponent) {
    const component = CheckPermissions(authority, wrappedComponent, classError || Exception403);
    return checkIsInstantiation(component);
  };
};

// Determine whether the incoming component has been instantiated
// AuthorizedRoute is already instantiated
// Authorized  render is already instantiated, children is no instantiated
// Secured is not instantiated
const checkIsInstantiation = (target) => {
  if (!React.isValidElement(target)) {
    return target;
  }
  return () => target;
};
const Exception403 = () => null;

Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.withAuthority = withAuthority;
export default Authorized;
