import React, { useState, useEffect } from 'react';
import { connect, useHistory } from 'dva';
import { Form, Checkbox, Input, Button, Layout, notification } from 'antd';
import { useMount } from 'ahooks';
import { login as loginReq, validateToken } from '@/services/user';
import bgImg from '@/assets/bg.jpg';
import styles from './login.less';

const { Header, Content } = Layout;
const layout = {
  wrapperCol: { span: 24 },
};

const Login = props => {
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const [form] = Form.useForm();

  useMount(() => {
    // 检查是否在登陆状态,就直接进应用
    // validateToken();
  });

  const handleSubmitLogin = () => {
    const { validateFields } = form;
    setSubmitting(true);
    validateFields()
      .then(values => {
        return loginReq(values);
      })
      .then(res => {
        if (res.code === 0) {
          history.push('/');
        }
      })
      .catch(e => console.log('%c e', 'color: red; font-size: 24px;', e))
      .finally(() => setSubmitting(false));
  };

  return (
    <Layout className={styles.main} style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover' }}>
      <Header className={styles.head}>YOUU</Header>
      <Content className={styles.mainContent}>
        <div className={styles.loginCard}>
          <div className={styles.logHead}>YOUUUI</div>
          <Form
            className={styles.logContent}
            {...layout}
            form={form}
            name="login"
            initialValues={{
              username: 'admin',
              password: 'admin',
              code: 'code',
            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请填写您的用户名' }]}
              className={styles.formItemNoBorderInput}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请填写您的密码' }]}
              className={styles.formItemNoBorderInput}
            >
              <Input.Password placeholder="请输入密码,注意大小写" />
            </Form.Item>
            <Form.Item name="code" rules={[{ required: true, message: '请填写验证码' }]} className={styles.formItemNoBorderInput}>
              <Input placeholder="请输入验证码" addonAfter={<a style={{ float: 'right', fontSize: 12 }}>点击获取验证码</a>} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSubmitLogin} className={styles.submit} loading={submitting}>
                登陆
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.logFooter}>
            请使用谷歌、火狐、QQ、360浏览器、不支持IE(
            <a href="https://www.microsoft.com/zh-cn/WindowsForBusiness/End-of-IE-support">安全隐患</a>)
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
