import React from 'react';
import { Col, Row, Select, InputNumber, Input, Form } from 'antd';
import { useHistory } from 'react-router-dom';
import Button from 'antd/es/button';
import IconPro from '@/components/IconPro';
import MaterialCard from '@/components/MaterialCard';
import { FormLayout, FormItem, FormTitle, FormBackgroundTitle } from '@/components/Form';

const render4Level = ({ getFieldValue }) => {
  console.log("getFieldValue('select3')", getFieldValue('select3'));
  return getFieldValue('select3') === '是' ? (
    <>
      <FormItem name="select4" label="四级" shouldUpdate>
        <Select>
          <Select.Option value="是">是</Select.Option>
          <Select.Option value="否">否</Select.Option>
        </Select>
      </FormItem>
      <FormItem name="select5" label="四级" shouldUpdate>
        <Select>
          <Select.Option value="是">是</Select.Option>
          <Select.Option value="否">否</Select.Option>
        </Select>
      </FormItem>
    </>
  ) : null;
};

export default function () {
  console.log('%c renderForm', 'color: red; font-size: 24px;', 1);

  const [form] = Form.useForm();
  const [complexForm] = Form.useForm();
  const handleHookOk = () => {
    const { validateFields } = form;
    validateFields().then((v) => console.log('%c handleHookOk', 'color: red; font-size: 24px;', v));
  };
  return (
    <Row gutter={32}>
      <Col span={16}>
        <MaterialCard header={<div>栅格布局112</div>}>
          <FormLayout>
            <FormItem span={24} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem span={12} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem span={12} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem span={8} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem span={8} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem span={8} name="select" label="YOUU">
              <Input />
            </FormItem>
          </FormLayout>
        </MaterialCard>
      </Col>
      <Col span={8}>
        <MaterialCard header={<div>纵向布局(栅格24)</div>} headColor="Geekblue">
          <FormLayout>
            <FormItem span={20} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem span={20} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem span={20} name="InputNumber" label="InputNumber">
              <InputNumber min={1} max={10} />
            </FormItem>
          </FormLayout>
        </MaterialCard>
      </Col>
      <Col span={16}>
        <MaterialCard header={<div>横向布局(无须输入span)</div>} headColor="Lime">
          <FormLayout>
            <FormItem name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem name="InputNumber" label="InputNumber">
              <InputNumber min={1} max={10} />
            </FormItem>
            <FormItem name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormItem name="select" label="YOUU">
              <Input />
            </FormItem>
          </FormLayout>
        </MaterialCard>
      </Col>
      <Col span={8}>
        <MaterialCard header={<div>表单标题</div>} headColor="Gold">
          <FormLayout title="表单总title">
            <Col span={20}>
              <FormTitle title="独立的title" />
            </Col>
            <FormItem span={20} name="select" label="YOUU">
              <Input />
            </FormItem>
            <FormBackgroundTitle title="背景块方式的title(与方块是个整体)">
              <FormItem span={20} name="select" label="YOUU">
                <Input />
              </FormItem>
            </FormBackgroundTitle>
          </FormLayout>
        </MaterialCard>
      </Col>
      <Col span={8}>
        <MaterialCard header={<div>hooks拿数据</div>} headColor="Cyan">
          <FormLayout form={form} title="hooks拿数据">
            <FormItem span={20} name="select" label="YOUU">
              <InputNumber min={1} max={10} />
            </FormItem>
            <FormItem span={24}>
              <Button onClick={handleHookOk}>提交</Button>
            </FormItem>
          </FormLayout>
        </MaterialCard>
      </Col>
      <Col span={8}>
        <MaterialCard header={<div>ref拿数据</div>} headColor="Cyan">
          <FormRef />
        </MaterialCard>
      </Col>
      <Col span={16}>
        <MaterialCard header={<div>各种联动,注意多层联动一定要嵌套,或者多层都判断一遍</div>} headColor="Lime">
          <FormLayout form={complexForm}>
            <FormItem name="select1" label="一级">
              <Select>
                <Select.Option value="是">是</Select.Option>
                <Select.Option value="否">否</Select.Option>
              </Select>
            </FormItem>
            <FormItem noStyle shouldUpdate>
              {({ getFieldValue }) => {
                if (getFieldValue('select1') === '是') {
                  return (
                    <>
                      <FormItem name="select2" label="二级" shouldUpdate>
                        <Select>
                          <Select.Option value="是">是</Select.Option>
                          <Select.Option value="否">否</Select.Option>
                        </Select>
                      </FormItem>
                      <FormItem noStyle shouldUpdate>
                        {() => {
                          if (getFieldValue('select2') === '是') {
                            return (
                              <>
                                <FormItem name="select3" label="三级" shouldUpdate>
                                  <Select>
                                    <Select.Option value="是">是</Select.Option>
                                    <Select.Option value="否">否</Select.Option>
                                  </Select>
                                </FormItem>
                                <FormItem noStyle shouldUpdate>
                                  {render4Level}
                                </FormItem>
                              </>
                            );
                          }
                        }}
                      </FormItem>
                    </>
                  );
                }
              }}
            </FormItem>
            <FormItem>
              <Button
                onClick={() => {
                  complexForm.setFieldsValue({
                    select1: '是',
                    select2: '是',
                    select3: '是',
                    select4: '是',
                    select5: '是',
                  });
                }}
              >
                给联动表单赋值
              </Button>
            </FormItem>
            <FormItem>
              <Button
                onClick={() => {
                  console.log(complexForm.getFieldsValue());
                }}
              >
                获取值
              </Button>
            </FormItem>
          </FormLayout>
        </MaterialCard>
      </Col>
    </Row>
  );
}

class FormRef extends React.Component {
  formRef = React.createRef();

  handleOk = () => {
    const { validateFields } = this.formRef.current;
    validateFields().then((v) => console.log('%c handleHookOk', 'color: red; font-size: 24px;', v));
  };

  render() {
    return (
      <FormLayout ref={this.formRef} title="ref拿数据">
        <FormItem span={20} name="select" label="YOUU">
          <InputNumber min={1} max={10} />
        </FormItem>
        <FormItem span={24}>
          <Button onClick={this.handleOk}>提交</Button>
        </FormItem>
      </FormLayout>
    );
  }
}
