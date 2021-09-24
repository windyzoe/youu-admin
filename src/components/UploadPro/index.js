/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import _ from 'lodash';
import { judgeFile } from './SimpleUpload';
import { getDownloadURL, getUploadUrl } from './download';

export default class UploadPro extends Component {
  beforeUpload = (file, fileList) => {
    const { value, size = 1 } = this.props;
    // 大小判断
    const judgeMessage = judgeFile(file);
    if (judgeMessage !== true) {
      Modal.error({
        centered: true,
        title: judgeMessage,
        okText: '关闭',
      });
      file.error = true;
      return false;
    }
    // 数值判断
    let allSize = value ? value.length : 0;
    allSize = fileList.length + allSize;
    if (allSize > size) {
      message.info(`只允许${size}个上传附件。多个附件请打包。`);
      // 将多余的文件标志为错误
      file.error = true;
      return false;
    } else {
      return true;
    }
  };

  handleChange = ({ fileList = [] }) => {
    const { onChange } = this.props;
    // 去除标志为错误的文件,去除返回值不是字符串的文件
    const files = fileList
      .filter((file) => !file.error)
      .filter((file) => {
        if (file.response) {
          const fileId = _.get(file.response, 'data.fileId');
          // 对上传结果进行过滤,如果返回的不是字符串,或者返回的是个html,按上传失败处理
          if (!_.isString(fileId)) {
            message.error('上传失败，请重试！');
            return false;
          }
        }
        return true;
      });
    const newfileList = files.map((item) => {
      const newItem = { ...item };
      newItem.fileId = item.fileId || _.get(item.response, 'data.fileId');
      newItem.fileName = item.name;
      newItem.url = getDownloadURL(newItem.fileId);
      return newItem;
    });
    onChange(newfileList);
  };

  render() {
    const { size = 1, value, beforeUpload = this.beforeUpload, tips, extra, children, disabled, ...props } = this.props;
    return (
      <Upload
        {...props}
        beforeUpload={beforeUpload}
        defaultFileList={value}
        fileList={value}
        onChange={this.handleChange}
        multiple={size !== 1}
        action={getUploadUrl()}
        withCredentials
        disabled={disabled}
      >
        {!disabled && children}
      </Upload>
    );
  }
}

// 将后端接口中的fileId和fileName转为upload表单认可的数据结构,注意直接传对象即可 ep:{fileid:11,fileName:22}
// 如果传的是数组对象,返回的也是文件对象数组
export function getUploadItems(itemOrArray) {
  if (!_.isObject(itemOrArray)) {
    return;
  }
  if (Array.isArray(itemOrArray)) {
    return itemOrArray
      .filter((v) => v.fileId && v.fileName)
      .map((v) => ({
        name: v.fileName,
        fileName: v.fileName,
        fileId: v.fileId,
        url: getDownloadURL(v.fileId),
      }));
  } else {
    const { fileName, fileId } = itemOrArray;
    if (!fileName || !fileId) return;
    return [
      {
        name: fileName,
        fileName,
        fileId,
        url: getDownloadURL(fileId),
      },
    ];
  }
}
