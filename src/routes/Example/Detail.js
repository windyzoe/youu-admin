/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { PageHeader, Button, Descriptions, Tabs } from 'antd';
import BasicContentLayout from '@/layouts/BasicContentLayout';

const { TabPane } = Tabs;

function App(props) {
  const {
    match: {
      params: { id },
    },
  } = props;
  return (
    <BasicContentLayout>
      <PageHeader
        onBack={() => window.history.back()}
        title="Title"
        subTitle="This is a subtitle"
        extra={[
          <Button key="3">Operation</Button>,
          <Button key="2">Operation</Button>,
          <Button key="1" type="primary">
            Primary
          </Button>,
        ]}
        footer={
          <Tabs defaultActiveKey="1">
            <TabPane tab="Details" key="1" />
            <TabPane tab="Rule" key="2" />
          </Tabs>
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
          <Descriptions.Item label="Id">
            <a>{id}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
          <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
          <Descriptions.Item label="Remarks">Gonghu Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </BasicContentLayout>
  );
}

export default App;
