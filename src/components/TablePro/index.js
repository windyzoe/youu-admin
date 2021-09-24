import React, { useState, useRef } from 'react';
import { Table, Space, Tooltip, Menu, Dropdown } from 'antd';
import { RedoOutlined, ColumnHeightOutlined } from '@ant-design/icons';
import ColumnSetting from './ColumnSetting';
import { TableContext } from './TableContext';
import { SearchToolbar } from './ToolBar';
import { genColumnKey } from './utils';
import styles from './index.less';

/**
 * @description 封装一个Table,做一些默认配置和css
 * @param {*} { paginationProps 分页属性, ...restProps 剩余的Table属性 }
 * @returns
 */
const TablePro = ({
  pagination,
  actionToolbar = true,
  searchToolbar,
  refresh,
  size = 'middle',
  columns,
  ...restProps
}) => {
  const [tableSize, setSize] = useState(size);
  const [columnsSet, setColumnsSet] = useState(() => {
    const value = {};
    columns.forEach((column) => {
      value[column.key] = column;
    });
    return value;
  }); // {$key:{fixed,show}}  列固定合列展示
  const columnSortKeys = useRef(columns.map((v, index) => genColumnKey(v.key, index))); //列排序

  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (totals) => `共${totals}个`,
    ...pagination,
  };
  const menu = (
    <Menu selectedKeys={[tableSize]} onClick={({ key }) => setSize(key)}>
      <Menu.Item key="default">偏大</Menu.Item>
      <Menu.Item key="middle">默认</Menu.Item>
      <Menu.Item key="small">紧凑</Menu.Item>
    </Menu>
  );
  // 列的动态计算---Start---
  const tableColumns = columns
    .map((item, index) => {
      const columnKey = genColumnKey(item.key, index);
      const config = columnsSet[columnKey] || {};
      return { ...item, ...config };
    })
    .sort((a, b) => a.order - b.order);

  const realColumns = tableColumns.filter((item, index) => {
    const columnKey = genColumnKey(item.key, index);
    const config = columnsSet[columnKey] || { show: true };
    return config.show !== false;
  });
  // 列的动态计算---End---
  return (
    <TableContext.Provider
      value={{
        columnsSet,
        setColumnsSet,
        columnSortKeys,
        setColumnSortKeys: (keys) => {
          columnSortKeys.current = keys;
        },
      }}
    >
      {actionToolbar && (
        <div className={styles.actionToolbar}>
          <Space size="large" style={{ order: React.isValidElement(actionToolbar) ? -1 : 1 }}>
            {refresh && (
              <ActionItem name="刷新" onClick={() => refresh()}>
                <RedoOutlined />
              </ActionItem>
            )}
            <ActionItem name="紧凑度">
              <Dropdown overlay={menu}>
                <ColumnHeightOutlined />
              </Dropdown>
            </ActionItem>
            <ActionItem name="列设置">
              <ColumnSetting checkable draggable columns={tableColumns} />
            </ActionItem>
          </Space>
          <div />
          <div style={{ order: React.isValidElement(actionToolbar) ? 1 : -1 }}>
            {React.isValidElement(actionToolbar) && actionToolbar}
          </div>
        </div>
      )}
      <Table size={tableSize} pagination={paginationProps} columns={realColumns} {...restProps} />
    </TableContext.Provider>
  );
};
const ActionItem = ({ children, name, onClick }) => (
  <Tooltip title={name}>
    <div className={styles.actionItem} onClick={onClick}>
      {children}
    </div>
  </Tooltip>
);

export * from './ToolBar';
TablePro.SearchToolbar = SearchToolbar;
export default TablePro;
