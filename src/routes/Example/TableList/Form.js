import React, { useState } from 'react';
import { useMount } from 'ahooks';
import { InputNumber, message, Select, Input, DatePicker, TreeSelect, Button } from 'antd';
import { UploadOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';
import UploadPro from '@/components/UploadPro';
import { FormLayout, FormBackgroundTitle, FormItem } from '@/components/Form';
import SectionRate from '@/components/Form/FormComponents/SectionRate';

const Option = { Select };

const AddForm = (props) => {
  const { addForm } = props;

  return (
    <FormLayout ref={addForm}>
      <FormBackgroundTitle title="基本信息">
        <FormItem span={12} label="名称" name="prdtNameAdd" rules={[{ required: true }]}>
          <Input />
        </FormItem>
        <FormItem span={12} label="类型" name="prdtType">
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            allowClear
            treeDefaultExpandAll
          />
        </FormItem>
        <FormItem span={12} label="时间" name="createDate">
          <DatePicker />
        </FormItem>
        <FormItem span={12} label="附件" name="file">
          <UploadPro>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </UploadPro>
        </FormItem>
      </FormBackgroundTitle>
      <FormBackgroundTitle title="参数">
        <FormItem label="线" name={['host', 'accountName']} span={12} rules={[{ required: true }]}>
          <Input placeholder="请输入0-1的小数" />
        </FormItem>
        <FormItem span={24} label="信息" name={['raising', 'file']}>
          <Input.TextArea placeholder="请输入投顾信息" />
        </FormItem>
      </FormBackgroundTitle>
      <FormBackgroundTitle title="参数二">
        <FormItem label="费用1" name={['host', 'accountName']} span={12} rules={[{ required: true }]}>
          <Input addonAfter="%" placeholder="请输入费用1" />
        </FormItem>
        <FormItem label="费用2" name={['host', 'largePayAccount']} span={12} rules={[{ required: true }]}>
          <Input addonAfter="%" placeholder="请输入费用1" />
        </FormItem>
        <FormItem label="费用3" name={['host', 'account']} span={12} rules={[{ required: true }]}>
          <Input addonAfter="%" placeholder="请输入费用3" />
        </FormItem>
        <FormItem label="费用类型" name="rengou" span={12} rules={[{ required: true }]}>
          <Select placeholder="请选择">
            <Option value={1}>单一</Option>
            <Option value={2}>分段</Option>
            <Option value={0}>无</Option>
          </Select>
        </FormItem>
        <FormItem shouldUpdate={(prev, curr) => prev.rengou !== curr.rengou} noStyle>
          {({ getFieldValue }) => {
            if (getFieldValue('rengou') === 1) {
              return (
                <FormItem label="单一费用" name="rengoufei" rules={[{ required: true }]}>
                  <Input />
                </FormItem>
              );
            }
          }}
        </FormItem>
        <FormItem shouldUpdate={(prev, curr) => prev.rengou !== curr.rengou} noStyle>
          {({ getFieldValue }) => {
            if (getFieldValue('rengou') === 2) {
              return (
                <FormItem label="费用-分段" name="rengoufeifenduan" span={24} rules={[{ required: true }]}>
                  <SectionRate />
                </FormItem>
              );
            }
          }}
        </FormItem>
      </FormBackgroundTitle>
    </FormLayout>
  );
};

export default AddForm;
