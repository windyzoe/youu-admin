import _ from 'lodash';
// *********关于权限的相关处理方法****************
let currentUser = {};

export function getRoles() {
  return _.get(currentUser, 'institutionRoleRsp');
}

export function getAuthority() {
  const roleItems = _.get(currentUser, 'institutionRoleRsp', []);
  return roleItems.map((role) => role.roleName).join(' ; ');
}

export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(v) {
  currentUser = v;
}
