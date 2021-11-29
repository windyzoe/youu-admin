// https://github.com/ant-design/ant-design/blob/master/components/style/themes/variable.less
const { getThemeVariables } = require('antd/dist/theme');

// 从antd拿紧凑模式的配置
const theme = getThemeVariables({ compact: true });
module.exports = {
  getTheme: params => {
    return {
      // ...theme,
      'red-base': '#F44336',
      'gold-base': '#FFC107',
      'green-base': '#4CAF50',
      'blue-base': '#448AFF',
      'geekblue-base': '#3F51B5',
      'lime-base': '#8bc34a',
      'cyan-base': '#00bcd4',
      'ant-prefix': process.env.REACT_APP_NAME,
    };
  },
  themeChanged: {
    'primaryColor': '#673AB7',
  },
};
