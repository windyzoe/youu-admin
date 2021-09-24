import intl from 'react-intl-universal';
import _ from 'lodash';
import zhCnAntd from 'antd/es/locale/zh_CN';
import enUsAntd from 'antd/es/locale/en_US';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';

require('intl/locale-data/jsonp/en.js');
require('intl/locale-data/jsonp/zh.js');

const antdLocale = { 'zh-CN': zhCnAntd, 'en-US': enUsAntd };
const LOCALE_KEY = 'lang';

/**
 * 国际化,https://github.com/alibaba/react-intl-universal
 * 注意需要同时配置antd和react-intl-universal,SUPPOER_LOCALES-value规范与antd一致
 */
export const SUPPOER_LOCALES = [
  {
    name: 'English',
    value: 'en-US',
  },
  {
    name: '简体中文',
    value: 'zh-CN',
  },
];

export async function initI18n() {
  const currentLocale = getCurrentLocale();
  return intl.init({
    currentLocale,
    locales: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  });
}
// 设置locale,设置完需要刷页面
export function changeLocale(locale) {
  if (locale !== localStorage.getItem(LOCALE_KEY, locale)) {
    localStorage.setItem(LOCALE_KEY, locale);
    window.location.reload();
  }
}
// 获取当前的locale信息,目前可以基于urlQuery,cookie,localstorage
export function getCurrentLocale() {
  let currentLocale = intl.determineLocale({
    urlLocaleKey: LOCALE_KEY,
    cookieLocaleKey: LOCALE_KEY,
    localStorageLocaleKey: LOCALE_KEY,
  });
  if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
    currentLocale = 'zh-CN';
  }
  return currentLocale;
}
// 获取当前antd Locale文件
export function getAntdLocale() {
  return antdLocale[getCurrentLocale()];
}
