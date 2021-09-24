import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Form, Divider, Row, Col, Input, Button, Select, Modal, Drawer, DatePicker, Popconfirm, Menu } from 'antd';
import { PlusOutlined, CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import BasicContentLayout from '@/layouts/BasicContentLayout';
import TablePro, { ViewAction, DeleteAction, EditAction, MoreAction } from '@/components/TablePro';
import DrawerPro from '@/components/DrawerPro';
import SimpleUpload from '@/components/UploadPro/SimpleUpload';
import AddForm from './Form';

const { RangePicker } = DatePicker;

/**
 * 列表页面实例，最佳copy方案
 * @export
 * @extends {React.PureComponent}
 */
export default class $请替换 extends React.PureComponent {
  // antd4 form 实例,注意弹框也有的form需新建实例
  searchForm = React.createRef();

  /**
   * 注意：如果切换页面后保留页面状态，请把相关状态切换到store中
   */
  state = {
    pageNo: 1,
    pageSize: 10,
    dataSource: [],
    visible: false,
  };

  columns = [
    {
      title: 'coloum1',
      dataIndex: 'coloum1',
      key: 'coloum1',
    },
    {
      title: 'coloum2',
      dataIndex: 'coloum2',
      key: 'coloum2',
    },
    {
      title: 'coloum3',
      dataIndex: 'coloum3',
      key: 'coloum3',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        // 直接操作的选项要加一步确认哦，Popconfirm
        return (
          <>
            <EditAction onClick={this.modify(record)} />
            <Divider type="vertical" />
            <Popconfirm title="确定删除XXX？" onConfirm={() => console.log('删除方法')}>
              <DeleteAction />
            </Popconfirm>
            <Divider type="vertical" />
            <ViewAction onClick={this.view(record)} />
            <Divider type="vertical" />
            <MoreAction
              menu={
                <Menu>
                  <Menu.Item key="1">1st menu item</Menu.Item>
                  <Menu.Item key="2">2nd menu item</Menu.Item>
                  <Menu.Item key="3">3rd menu item</Menu.Item>
                </Menu>
              }
            />
          </>
        );
      },
    },
  ];

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {}

  /**
   * 列表刷新方法
   * @param {*} [params={}] 需要更新的查询参数
   */
  init = (params = {}) => {
    // 从state里拿页面数据
    const { pageNo, pageSize } = this.state;
    this.setState({ loading: true });
    const searchValues = this.getSearchFormValues();
    // ---把页面值\搜索值\传入值整合---
    const pageParams = { pageNo, pageSize, ...searchValues, ...params };
    // ----填写异步的列表请求，替换成你的真实请求----
    const yourServiceMethod = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ data: { records: [{ coloum1: '我', coloum2: '最', coloum3: '牛' }], totalRecords: 1 } });
        }, 2000);
      });
    };
    // 发起请求，处理后端数据，totalRecords总数量、records列表数据
    yourServiceMethod(pageParams).then((res) => {
      this.setState({
        // ----lodash取值不会空指针----
        dataSource: _.get(res, 'data.records'),
        ...pageParams,
        total: _.get(res, 'data.totalRecords'),
        loading: false,
      });
    });
  };

  // 搜索事件
  search = () => {
    this.init({ pageNo: 1 });
  };

  // 高阶函数的写法引入record
  modify = (record) => () => {
    this.setState({ visible: true }, () => console.log(record));
  };

  // 高阶函数的写法引入record
  view = (record) => () => {
    this.setState({ visible: true }, () => console.log(record));
  };

  add = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  // 一个简单的上传文件的例子
  upload = (fileList, visibleFalseCallback, setLoading) => {
    console.log('%c fileList', 'color: red; font-size: 24px;', fileList);
    setLoading(true);
  };

  /**
   * 获取查询的选项值
   */
  getSearchFormValues = () => {
    const { getFieldsValue } = this.searchForm.current;
    const formValues = getFieldsValue(['name', 'date']);
    const transMoment = (d) => (moment.isMoment(d) ? d.format('YYYY-MM-DD') : d);
    const startDate = _.get(formValues, 'date[0]');
    const endDate = _.get(formValues, 'date[1]');
    // 清空date，传入开始时间和终止时间
    return { ...formValues, startDate: transMoment(startDate), endDate: transMoment(endDate), date: undefined };
  };

  // 跳转页面事件
  changePage = (pagination) => {
    const { current, pageSize } = pagination;
    this.init({
      pageSize,
      pageNo: current,
    });
  };

  // 一般都会弹窗干点啥，使用DrawerPro|| ModalPro
  renderModal = () => {
    const { visible } = this.state;
    return (
      <DrawerPro title="填写名称" visible={visible} onCancel={this.hideModal} width={720}>
        <AddForm />
      </DrawerPro>
    );
  };

  render() {
    const { dataSource, pageNo, pageSize, total, loading } = this.state;
    const pagination = {
      current: pageNo,
      pageSize,
      total,
    };
    return (
      <BasicContentLayout>
        <TablePro.SearchToolbar onSubmit={this.search} formRef={this.searchForm} unCollapsedNum={3}>
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="时间" name="date">
            <RangePicker />
          </Form.Item>
          <Form.Item label="选项" name="filter">
            <Select style={{ width: 120 }} placeholder="请选择">
              <Select.Option value="芭啦芭啦樱之花">芭啦芭啦樱之花</Select.Option>
              <Select.Option value="恐龙特急克塞号">恐龙特急克塞号</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="类型" name="option">
            <Select style={{ width: 150 }} placeholder="请选择">
              <Select.Option value="react">react</Select.Option>
              <Select.Option value="vue">vue</Select.Option>
            </Select>
          </Form.Item>
        </TablePro.SearchToolbar>
        <TablePro
          loading={loading}
          dataSource={dataSource}
          columns={this.columns}
          pagination={pagination}
          onChange={this.changePage}
          actionToolbar={
            <Button.Group>
              <Button icon={<PlusOutlined />} onClick={this.add}>
                新增
              </Button>
              <SimpleUpload customRequest={this.upload} title="导入">
                <Button icon={<CloudUploadOutlined />}>导入</Button>
              </SimpleUpload>
              <Button icon={<CloudDownloadOutlined />}>导出</Button>
            </Button.Group>
          }
          refresh={this.init}
        />
        {this.renderModal()}
      </BasicContentLayout>
    );
  }
}
