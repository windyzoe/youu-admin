import React from 'react';
import { extend } from 'umi-request';
import { message, notification } from 'antd';
import { routerRedux } from 'dva';
import _ from 'lodash';
import { getStore } from '@/app';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方式不正确.',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 打印出错误详情
 *
 * @param {*} message
 */
function info(detail) {
  notification.info({
    content: (
      <div>
        <pre>{detail}</pre>
      </div>
    ),
    onOk() {},
  });
}

// umi的errorHandle只针对http的状态码
const httpStatusErrorHandle = (error) => {
  if (error.response) {
    const httpError = new Error();
    httpError.name = `网络出错 状态码：${error.response.status}`;
    httpError.message = codeMessage[error.response.status];
    httpError.response = error.response;
    httpError.type = 'http';
    throw httpError;
  } else {
    const httpError = new Error();
    httpError.name = `网络出错 状态码：未知`;
    httpError.message = '未知错误请联系管理员';
    httpError.response = {};
    httpError.type = 'http';
    throw httpError;
  }
};

/**
 *处理业务请求的切面
 *errorCode=0 成功 errorCode=0xxx切面拦截通用输出 errorCode=1xxxx业务逻辑里专门处理 errorCode=100401无权限，需要重新登陆
 * @param {*} data
 * @returns
 */
function serviceErrorHandle({ data, response }) {
  const { code, msg, detail } = data;
  if (code && String(code) !== '0') {
    // 无权限，需要重新登陆
    if (String(code) === '100401') {
      const error = new Error('无权限,需重新登录');
      error.type = 'noAuth';
      throw error;
    }
    // errorCode=1xxxx业务逻辑里专门处理
    if (String(code).indexOf('1') === 0) {
      return data;
    }
    const error = new Error();
    error.name = `服务出错了 编号：${code}`;
    error.message = msg;
    error.detail = detail;
    error.response = data;
    error.code = Number(code);
    error.type = 'service';
    throw error;
  }
  return data;
}

// 对UMI request进行扩展   https://github.com/umijs/umi-request
const umiRequest = extend({
  prefix: '/api',
  timeout: 1000, //超时设置
  credentials: 'include',
  requestType: 'json', //json form 可选
  responseType: 'json', //text, blob, arrayBuffer, formData 可选
  getResponse: true,
  headers: { xxxToken: 'xxxxxxxxx' }, //token认证
  errorHandler: httpStatusErrorHandle, //http错误处理
});

// 维护一个全局请求队列
const postMethodArray = [];

// 全局的防抖,目前没有用防抖和AbortController,直接用的节流,俩相同请求不能在1秒内
umiRequest.interceptors.request.use((url, options) => {
  const controller = new AbortController(); // create a controller
  const { signal } = controller;
  if (options.method === 'post') {
    const time = Date.now();
    // 用url+body作为key
    const key = `${url}${JSON.stringify(options.data)}`;
    // 撞队列,相同key间隔小于1秒
    const isThrottle = postMethodArray.some((v) => v.key === key && time - v.time < 1000);
    // 更新队列
    _.pullAllBy(postMethodArray, (v) => time - v.time > 1000);
    if (isThrottle) {
      // 撞成功了就抛异常,不请求
      const error = new Error();
      error.name = `重复提交`;
      error.message = '您当前操作过于频繁(重复点击了确认按钮哦),请不要手抖!';
      error.type = 'throttle';
      throw error;
    }
    // 没撞成功就放进队列里
    postMethodArray.push({ controller, time, key });
  }
  return {
    url,
    options: { ...options, signal },
  };
});

// 添加get全局的标签,防止缓存请求
umiRequest.interceptors.request.use((url, options) => {
  const time = Date.now();
  return {
    url: options.method === 'get' ? (url.includes('?') ? `${url}&t=${time}` : `${url}?t=${time}`) : url,
    options,
  };
});

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"&umirequest
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return umiRequest(url, options)
    .then(serviceErrorHandle)
    .catch((error) => {
      if (['noAuth'].includes(error.type)) {
        getStore().dispatch(routerRedux.push('/user/login'));
      }
      if (['service', 'http', 'throttle'].includes(error.type)) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      throw error;
    });
}
