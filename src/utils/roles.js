import React from 'react';
import { Tag } from 'antd';
import _ from 'lodash';

const allRoles = [
  { roleName: '管理员', id: 1 },
  { roleName: '操作师', id: 2 },
];

let colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
colors = colors.concat(colors).concat(colors);

export function renderRole(roleName) {
  const index = _.findIndex(allRoles, (item) => item.roleName === roleName);
  const color = _.get(colors, `[${index}]`, 'cyan');
  return (
    <span style={{ margin: '0 4px 8px 0', display: 'inline-block' }}>
      <Tag color={color}>{roleName}</Tag>
    </span>
  );
}
