import React from 'react';
import { Row, Col, Form, Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const gridConfig = {
  col: {
    1: { xs: 24, sm: 24 },
    2: { xs: 24, sm: 12 },
    3: { xs: 24, sm: 12, md: 8 },
    4: { xs: 24, sm: 12, md: 6, xl: 6 },
  },
  formItemLayout: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  },
};

const { col, formItemLayout } = gridConfig;

const tailFormItemLayout = {
  labelCol: { sm: 4 },
  wrapperCol: { sm: 20 },
};

const ExhibitionTitle = (props) => {
  const { title, rightContent, style = {} } = props;
  return (
    <div className={styles.title_main} style={{ ...style }}>
      <h3 className={styles.title}>
        <span className={styles.name} />
        {title}
      </h3>
      <span className="right_content">{rightContent}</span>
    </div>
  );
};

/* eslint-disable */
const Exhibition = (props) => {
  const { backgroungColor = '#F7F7F7', layout, labelAlign = 'right', span = 2, children = [] } = props;
  const formLayout = layout ? layout : formItemLayout;

  const child = Array.isArray(children)
    ? children.filter(Boolean).map((v) => (
        <Col key={Math.random()} {...col[v.props.span || span]}>
          {v}
        </Col>
      ))
    : children;

  return (
    <Form labelAlign={labelAlign} {...formLayout}>
      <Row className={styles.wrap} style={{ background: backgroungColor }}>
        {child}
      </Row>
    </Form>
  );
};

const ExhibitionItemText = (props) => {
  const { label = '', value = '', children = [], span, nowrap, scroll, childLayout } = props;
  const childLayouts = childLayout ? childLayout : tailFormItemLayout;
  const rows = span ? childLayouts : {};

  return (
    <Form.Item {...rows} label={label} key={label}>
      <Tooltip placement="topLeft" title={nowrap ? value : ''}>
        <span
          className={classNames('ant-form-text', {
            nowrap: nowrap,
            scroll: scroll,
          })}
        >
          {value || children}
        </span>
      </Tooltip>
    </Form.Item>
  );
};

export { Exhibition, ExhibitionTitle, ExhibitionItemText };
