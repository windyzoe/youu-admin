import React, { useState } from 'react';
import { Tooltip, Form, Button, Dropdown } from 'antd';
import { DownOutlined, UpOutlined, FormOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './index.less';

/** 搜索内容的封装
 * @description
 * @param {*} {
 *   children,
 *   onSubmit,
 *   onReset,
 *   submitName,
 *   resetName,
 *   extraRight,
 *   form, hook form instance
 *   formRef, react ref instance
 * }
 * @returns
 */
export const SearchToolbar = ({
  children,
  onSubmit,
  onReset,
  submitName,
  resetName,
  defaultCollapsed = true,
  unCollapsedNum,
  form,
  formRef,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <Form ref={formRef} form={form} layout="inline" onReset={onReset} className={styles.form}>
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, { hidden: unCollapsedNum && index >= unCollapsedNum && collapsed });
      })}
      <Form.Item>
        {onReset && <Button htmlType="reset">{resetName || '重置'}</Button>}
        {onSubmit && (
          <Button type="primary" htmlType="button" onClick={onSubmit}>
            {submitName || '查询'}
          </Button>
        )}
      </Form.Item>
      {unCollapsedNum && (
        <Form.Item>
          <a onClick={() => setCollapsed((prev) => !prev)}>
            {collapsed ? (
              <span>
                展开
                <DownOutlined />
              </span>
            ) : (
              <span>
                收起
                <UpOutlined />
              </span>
            )}
          </a>
        </Form.Item>
      )}
    </Form>
  );
};

const ActionStyle = { fontSize: '1.1rem' };

export function EditAction(props) {
  return (
    <Tooltip title="编辑">
      <a {...props}>
        <FormOutlined style={{ ...ActionStyle }} />
      </a>
    </Tooltip>
  );
}

export function DeleteAction(props) {
  return (
    <Tooltip title="删除">
      <a {...props}>
        <DeleteOutlined style={{ ...ActionStyle }} />
      </a>
    </Tooltip>
  );
}

export function ViewAction(props) {
  return (
    <Tooltip title="查看详情">
      <a {...props}>
        <EyeOutlined style={{ ...ActionStyle }} />
      </a>
    </Tooltip>
  );
}

export function MoreAction(props) {
  const { menu } = props;
  return (
    <Dropdown overlay={menu}>
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );
}
