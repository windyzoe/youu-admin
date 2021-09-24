import React, { useContext } from 'react';
import { Form, Col, notification } from 'antd';
import _ from 'lodash';
import FormContext from './FormContext';
import styles from './index.less';

const FormItem = ({ children, span, noStyle, ...restProps }) => {
  // ----全局处理disable----
  const { disabled, column } = useContext(FormContext);
  let childrenPro = children;
  if (_.isBoolean(disabled)) {
    if (React.isValidElement(children)) {
      childrenPro = React.cloneElement(children, { disabled });
    }
  }
  if (_.isFunction(disabled)) {
    if (React.isValidElement(children)) {
      const { name } = restProps;
      childrenPro = React.cloneElement(children, { disabled: disabled(name) });
    }
  }
  // ----全局处理disable----

  // nostyle情况的处理,antd4用render props处理的联动
  if (noStyle) {
    return (
      <Form.Item noStyle {...restProps}>
        {childrenPro}
      </Form.Item>
    );
  }
  return (
    <Col span={span || 24 / column} className={styles.background}>
      <Form.Item {...restProps}>{childrenPro}</Form.Item>
    </Col>
  );
};

export { FormItem };
