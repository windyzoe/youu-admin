const fs = require('fs');
const path = require('path');
// mock数据
const mock = require('./mock');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// ****mocker-api的配置,不知道roadhog和mockerapi谁抄谁****
// *****
const proxy = {
  // -----代理proxy的配置-----
  _proxy: {
    proxy: {
      // key值如何定义参考： https://www.npmjs.com/package/path-to-regexp
      // '/api/(.*)': 'http://localhost:9999/',
    },
    pathRewrite: {
      // '^/example/first/': '/example',
    },
    changeHost: true,
  },
  ...mock,
};
module.exports = proxy;
