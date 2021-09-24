import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request(`/api/user`);
}

export async function login(data) {
  return request(`/login`, {
    method: 'post',
    data: {
      ...data,
    },
  });
}

export async function logout(data) {
  return request(`/logout`, {
    method: 'post',
    data: {
      ...data,
    },
  });
}

export async function validateToken(data) {
  return request(`/validateToken`, {
    method: 'post',
    data: {
      ...data,
    },
  });
}

export async function getMenu(data) {
  return request(`/menus`);
}

// 获取用户所有信息
export async function getUserAllInfo() {
  return request(`/user/getPersonUserInfo`);
}

export async function queryCurrent() {
  return request(`currentUser`);
}

export async function userList() {
  return request(`/userList`);
}

export async function roleList() {
  return request(`/roleList`);
}
