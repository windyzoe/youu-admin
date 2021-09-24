import React, { PureComponent } from 'react';
import { List, Tag, Input, Button, Modal, message, Row, Col } from 'antd';
import { PlusOutlined, PhoneOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import _ from 'lodash';
import BasicContentLayout from '@/layouts/BasicContentLayout';
import { EditAction, DeleteAction } from '@/components/TablePro';
import { FormLayout, FormBackgroundTitle, FormItem } from '@/components/Form';
import DrawerPro from '@/components/DrawerPro';
import { pwdPattern, emailAddressPattern, mobilePattern, getPageQuery } from '@/utils/utils';
import { userList, roleList } from '@/services/user';
import { renderRole } from '@/utils/roles';
import Styles from './index.less';

const { Search } = Input;
const { CheckableTag } = Tag;

export default class User extends PureComponent {
  formRef = React.createRef();

  state = {
    isShow: false,
    isAdd: true,
    selectedTags: [],
    userInfo: [],
    total: 0,
    pageNo: 1,
    pageSize: 10,
    roles: [],
  };

  componentDidMount() {
    this.setState({ searchValue: getPageQuery().search }, () => this.init());
  }

  handleSearch() {
    this.init({
      pageNo: 1,
    });
  }

  handleOk(setLoadingFalse) {
    this.formRef.current
      .validateFields()
      .then(v => v)
      .finally(setLoadingFalse());
  }

  userOperation = (mode, record) => {
    if (mode === 'delete') {
      this.doDelete(record);
      return;
    }
    if (mode === 'add') {
      this.setState({ isAdd: true, isShow: true });
    } else {
      const selectedTags = record.roles.map(el => el.id);
      this.setState(
        {
          isAdd: false,
          isShow: true,
          selectedTags: _.uniq(selectedTags),
        },
        () => {
          this.formRef.current.setFieldsValue({
            ...record,
          });
        }
      );
    }
  };

  init = params => {
    const { pageNo, pageSize } = this.state;
    userList({ pageNo, pageSize, ...params }).then(res => {
      this.setState({
        userInfo: res?.data?.userInfo,
        total: 2,
        pageNo,
        pageSize,
        ...params,
      });
    });
    roleList().then(res =>
      this.setState({
        roles: res?.data,
      })
    );
  };

  handleDelUser = item => {
    Modal.confirm({
      title: `确定删除用户“${item.userName}”吗？`,
      centered: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => this.userOperation('delete', item),
      onCancel: () => {},
    });
  };

  handleCancel = () => {
    this.setState({
      isShow: false,
      selectedTags: [],
    });
  };

  pageChange = (pageNo, pageSize) => {
    this.init({
      pageNo,
      pageSize,
    });
  };

  handleChange = (tag, checked) => {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: _.uniq(nextSelectedTags) });
  };

  description = item => {
    return (
      <Row gutter={16}>
        <Col span={12}>
          <PhoneOutlined /> {item.mobile}
        </Col>
        <Col span={12}>
          {item.email ? <MailOutlined /> : null} {item.email}
        </Col>
        <Col span={12}>
          {item.deptName ? <BankOutlined /> : null} {item.deptName}
        </Col>
      </Row>
    );
  };

  doDelete = v => {
    message.warn('删除用户暂未开通');
  };

  renderAdd = () => {
    const { isShow, roles, isAdd, selectedTags } = this.state;
    return (
      <DrawerPro
        width={660}
        visible={isShow}
        title={isAdd ? '新增用户' : '编辑用户'}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <FormLayout ref={this.formRef}>
          <FormBackgroundTitle title="用户信息">
            <FormItem label="用户名" name="userName" rules={[{ required: true }]}>
              <Input placeholder="请输入用户名" />
            </FormItem>
            <FormItem label="登录名" name="loginName" rules={[{ required: true }]}>
              <Input disabled={!isAdd} placeholder={isAdd ? '请输入登录名' : null} />
            </FormItem>
            {isAdd && (
              <>
                <FormItem
                  label="登录密码"
                  name="oldPassword"
                  rules={[{ required: true }, { pattern: pwdPattern, message: '密码为12个字符，必须由英文，数字及特殊符号组成' }]}
                >
                  <Input type="password" placeholder="密码为12个字符，必须由英文，数字及特殊符号组成" />
                </FormItem>
                <FormItem label="密码确认" name="password" validateTrigger={['onBlur']} rules={[{ required: true }]}>
                  <Input type="password" placeholder="请确认登陆密码" />
                </FormItem>
              </>
            )}
          </FormBackgroundTitle>
          <FormBackgroundTitle title="联系信息">
            <FormItem
              label="邮箱地址"
              name="email"
              rules={[{ required: true }, { pattern: emailAddressPattern, message: '邮箱格式错误' }]}
            >
              <Input placeholder="请输入邮箱地址" />
            </FormItem>
            <FormItem
              label="手机号码"
              name="mobile"
              rules={[{ required: true }, { pattern: mobilePattern, message: '手机号格式不正确' }]}
            >
              <Input placeholder="请输入手机号码" />
            </FormItem>
          </FormBackgroundTitle>
          <FormBackgroundTitle title="角色">
            <FormItem>
              {Array.isArray(roles) &&
                roles.map(item => (
                  <CheckableTag
                    style={{ marginBottom: 3, marginTop: 3 }}
                    key={item.id}
                    checked={selectedTags.indexOf(item.id) > -1}
                    onChange={checked => this.handleChange(item.id, checked, item)}
                  >
                    {item.roleName}
                  </CheckableTag>
                ))}
            </FormItem>
          </FormBackgroundTitle>
        </FormLayout>
      </DrawerPro>
    );
  };

  render() {
    const { userInfo, isShow, total, searchValue } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total,
      showTotal: totals => `共 ${totals} 个`,
      onChange: this.pageChange,
      onShowSizeChange: this.pageChange,
      size: 'small',
    };
    return (
      <BasicContentLayout>
        <div className={Styles.main}>
          <Search
            placeholder="搜索用户名"
            onSearch={value => this.handleSearch(value)}
            style={{ width: 420, float: 'right', marginBottom: '12px' }}
            enterButton
            allowClear
            value={searchValue}
            onChange={v => this.setState({ searchValue: v.target.value })}
          />
          <Button type="dashed" style={{ width: '100%', marginBottom: '12px' }} onClick={() => this.userOperation('add')}>
            <PlusOutlined /> 添加新用户
          </Button>
          <List
            itemLayout="horizontal"
            dataSource={userInfo}
            pagination={pagination}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
                  <EditAction onClick={() => this.userOperation('update', item)} />,
                  <DeleteAction onClick={() => this.handleDelUser(item)} />,
                ]}
              >
                <div style={{ width: '20rem', flex: 'none' }}>{item.userName}</div>
                <div style={{ display: 'flex', flex: 'auto' }}>
                  <div style={{ width: '20rem', flex: 'none' }}>{this.description(item)}</div>
                  <div style={{ flex: 'auto' }}>{item.roles.map(element => renderRole(element.roleName))}</div>
                </div>
              </List.Item>
            )}
          />
        </div>
        {isShow && this.renderAdd()}
      </BasicContentLayout>
    );
  }
}
