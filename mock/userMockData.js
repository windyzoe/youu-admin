const roles = [
  {
    id: 1,
    isValid: null,
    roleName: '管理员',
  },
  {
    id: 2,
    isValid: null,
    roleName: '操作师',
  },
];

const userInfo = [
  {
    userName: '用户1',
    userContact: '123',
    mobile: '1238898111',
    email: '2@22.cc',
    deptName: 'IT',
    roles: [{ roleName: '操作师', id: 2 }],
  },
  {
    userName: '用户2',
    userContact: '123',
    mobile: '4451123333',
    email: '1@33.cc',
    deptName: 'TECH',
    roles: [{ roleName: '管理员', id: 1 }],
  },
];

const menuData = [
  {
    name: '微前端',
    icon: 'icon-ziyuan',
    path: 'myApp1',
    children: [
      {
        name: 'myApp1',
        path: 'example',
        children: [
          {
            name: '列表',
            path: 'list',
          },
        ],
      },
    ],
  },
  {
    name: '样例',
    icon: 'icon-shezhi',
    path: 'example',
    children: [
      {
        name: '展板',
        path: 'dashboard',
      },
      {
        name: '表单',
        path: 'form',
      },
      {
        name: '错误边界',
        path: 'errorBoundary',
      },
      {
        name: '动画',
        path: 'cssanimate',
      },
      {
        name: '富文本',
        path: 'editor',
      },
      {
        name: '列表hook版',
        path: 'listHook',
      },
      {
        name: '用户列表',
        path: 'user',
      },
      {
        name: '列表',
        path: 'list',
        // hideInBreadcrumb: true, // 是否隐藏面包屑
        // hideInMenu: true, // 是否在菜单中隐藏
        // authority:[""], //什么角色可以看
      },
    ],
  },
];
module.exports = { roles, menuData, userInfo };
