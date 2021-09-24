const datas = require('./userMockData');
// https://github.com/jaywcjlove/mocker-api
const mock = {
  // 本地mock示例
  'GET /api/user': {
    id: 1,
    username: 'kenny',
    sex: 6,
  },
  'GET /api/menus': (req, res) => {
    return res.json({
      code: 0,
      data: datas.menuData,
    });
  },
  'POST /api/login': (req, res) => {
    const { password, username } = req.body;
    if (password === 'admin' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 0,
        token: 'sdfsdfsdfdsf',
        data: {
          id: 1,
          username: 'kenny',
          sex: 6,
        },
      });
    } else {
      return res.status(403).json({
        status: 'error',
        code: 403,
      });
    }
  },
  'POST /api/logout': (req, res) => {
    return res.json({
      status: 'ok1',
      code: 0,
    });
  },
  'GET /api/roleList': (req, res) => {
    return res.json({
      code: 0,
      data: datas.roles,
    });
  },
  'GET /api/userList': (req, res) => {
    return res.json({
      code: 0,
      data: {
        userInfo: datas.userInfo,
        total: 2,
      },
    });
  },
};

module.exports = mock;
