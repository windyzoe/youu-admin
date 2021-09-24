/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Upload, Modal, message, Button, Popover } from 'antd';
import { UploadOutlined, FolderOutlined } from '@ant-design/icons';
import _ from 'lodash';

export function judgeFile(file) {
  if (file.name.length > 190) {
    return '文件名过长，请修改文件名后再上传';
  } else if (file.size <= 0) {
    return '上传文件大小不能为0字节';
  } else if (file.size > 104857600) {
    return '上传文件大小超过限制（最大限制100M）';
  }
  return true;
}

export default class SimpleUpload extends Component {
  state = {
    fileList: [],
    visible: false,
    loading: false,
  };

  cusId = _.uniqueId('simpleUpload');

  beforeUpload = (file, fileList) => {
    const judgeMessage = judgeFile(file);
    if (judgeMessage !== true) {
      Modal.error({
        centered: true,
        title: judgeMessage,
        okText: '关闭',
      });
      return false;
    }
    this.setState({ fileList: [file] });
    return false;
  };

  request = () => {
    const { customRequest } = this.props;
    const { fileList } = this.state;
    customRequest(
      fileList,
      () => this.setState({ visible: false }), //设置隐藏的回调
      (loadingV) => this.setState({ loading: loadingV }) //提供一个设置loading状态的函数
    );
  };

  render() {
    const { children, title, placement = 'bottomRight', maxCount = 1, accept, ...restProps } = this.props;
    const { fileList, visible, loading } = this.state;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: this.beforeUpload,
      fileList,
      accept,
      maxCount,
    };
    const content = (
      <>
        <Upload withCredentials {...props}>
          <Button style={{ paddingLeft: 0 }} icon={<FolderOutlined />} type="text">
            选择文件
          </Button>
        </Upload>
        <div style={{ marginTop: 16 }}>
          <Button
            size="small"
            type="primary"
            disabled={!Array.isArray(fileList) || fileList.length === 0}
            onClick={this.request}
            loading={loading}
          >
            开始上传
          </Button>
          <Button size="small" style={{ marginLeft: 12 }} onClick={() => this.setState({ visible: false })}>
            取消
          </Button>
        </div>
      </>
    );
    return (
      <Popover
        visible={visible}
        onVisibleChange={(visibleV) => {
          if (visibleV) {
            this.setState({ visible: visibleV });
          }
        }}
        trigger="click"
        content={content}
        title={
          <span style={{ fontWeight: 700 }}>
            {<UploadOutlined style={{ marginRight: 12 }} />}
            {title}
          </span>
        }
        placement={placement}
        getPopupContainer={() => document.getElementById(this.cusId)}
      >
        {children}
        <div id={this.cusId} />
      </Popover>
    );
  }
}
