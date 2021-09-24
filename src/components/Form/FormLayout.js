import React from 'react';
import { Col, Row, Form } from 'antd';
import styles from './index.less';
import FormContext from './FormContext';

const gutter = 36;

/**
 * @param disabled<Boolean|Function> Global disable definition ,ex:(name)=>["feild1","field2"].includes(name),return boolean
 */
const FormLayout = React.forwardRef(({ children, title, disabled, column = 2, ...restProps }, ref) => {
  return (
    <FormContext.Provider value={{ disabled, column }}>
      <Form layout="vertical" {...restProps} ref={ref} preserve={false}>
        <FormTitle title={title} />
        <Row gutter={gutter}>{children}</Row>
      </Form>
    </FormContext.Provider>
  );
});

/**
 * @description 有背景的title,加灰色背景,
 * @param {*} { title, children } 必须在{FormLayout}里面使用
 * @returns
 */
const FormBackgroundTitle = ({ title, children }) => {
  return (
    <>
      <Col span={24}>
        <FormTitle title={title} />
      </Col>
      <Col span={24}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.03)' }} className={styles.content}>
          <Row gutter={gutter}>{children}</Row>
        </div>
      </Col>
    </>
  );
};

const FormTitle = ({ title }) => {
  return title ? <div className={styles.formTitle}>{title}</div> : null;
};

export { FormLayout, FormTitle, FormBackgroundTitle };
