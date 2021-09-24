import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, Input, Select, Card, Button, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const initValue = [
  { start: 0, end: null, rate: null, checked: true },
  { start: null, end: null, rate: null, checked: true },
];

function transformValueToForm(props, changedValue) {
  const newValues = changedValue.map((item, index) => {
    let valRelationCode = null;
    if (item.checked) {
      valRelationCode = index !== changedValue.length - 1 ? 4 : 7;
    } else {
      valRelationCode = index !== changedValue.length - 1 ? 5 : 8;
    }
    return {
      feeType: props.type,
      feeUnit: props.rateUnit[0],
      rateVal: item.rate,
      valMax: item.end,
      valMin: item.start,
      valRelationCode,
      valUnit: props.sectionUnit[0],
    };
  });
  return newValues;
}

function transformFormToValue(props, formValue) {
  if (!formValue || formValue.length === 0) {
    return initValue;
  }
  const filtersValue = formValue.filter((item) => String(item.feeType) === String(props.type));
  const newContents = filtersValue.map((item) => {
    return {
      start: item.valMin,
      end: item.valMax,
      rate: item.rateVal,
      checked: item.valRelationCode === 4 || item.valRelationCode === 7,
    };
  });
  return newContents;
}

/**
 *表单用的专门用来做分段数据
 *
 * @export
 * @class SectionRate
 * @extends {React.PureComponent}
 */
export default class SectionRate extends React.PureComponent {
  static propTypes = {
    sectionUnit: PropTypes.array,
    rateUnit: PropTypes.array,
    title: PropTypes.string,
  };

  static defaultProps = {
    sectionUnit: ['元'],
    rateUnit: ['%'],
    title: '',
  };

  triggerChange = _.debounce((changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    const newArray = [];
    if (onChange) {
      onChange(transformValueToForm(this.props, newArray.concat(changedValue.contents)));
    }
  }, 1000);

  constructor(props) {
    super(props);
    let value = initValue;
    if (props.value) {
      value = transformFormToValue(props, props.value);
    }
    this.state = {
      contents: value,
    };
  }

  /**
   * 在didpudate里实现，antd form控制value的捕捉，捕捉到则更新表单的值
   */
  componentDidUpdate(prevProps, prevState) {
    const { contents } = this.state;
    const { value } = this.props;
    const formValue = transformFormToValue(this.props, value);
    if (_.isEqual(contents, prevState.contents)) {
      let newContents = initValue;
      if (Array.isArray(value)) {
        newContents = formValue;
      }
      if (!_.isEqual(newContents, contents)) {
        this.setState({ contents: newContents }); // eslint-disable-line
      }
    }
  }

  handleStartChange = (e, index) => {
    const { contents } = this.state;
    const newContents = _.cloneDeep(contents);
    newContents[index].start = e.target.value;
    this.setState({ contents: newContents });
    this.triggerChange({ contents: newContents });
  };

  handleEndChange = (e, index) => {
    const { contents } = this.state;
    const newContents = _.cloneDeep(contents);
    newContents[index].end = e.target.value;
    newContents[index + 1].start = e.target.value;
    this.setState({ contents: newContents });
    this.triggerChange({ contents: newContents });
  };

  handleRateChange = (e, index) => {
    const { contents } = this.state;
    const newContents = _.cloneDeep(contents);
    newContents[index].rate = e.target.value;
    this.setState({ contents: newContents });
    this.triggerChange({ contents: newContents });
  };

  handleAddLine = () => {
    const { contents } = this.state;
    const line = { start: null, end: null, rate: null, checked: contents[0].checked };
    const newContents = _.cloneDeep(contents);
    newContents.push(line);
    this.setState({ contents: newContents });
    this.triggerChange({ contents: newContents });
  };

  handleDeleteLine = (index) => {
    const { contents } = this.state;
    const newContents = _.cloneDeep(contents);
    newContents.splice(index, 1);
    if (contents.length - 1 === index) {
      newContents[index - 1].end = null;
    }
    this.setState({ contents: newContents });
    this.triggerChange({ contents: newContents });
  };

  handleRelationChange = (e) => {
    const { contents } = this.state;
    const newContents = _.cloneDeep(contents);
    const newNewContents = newContents.map((item) => {
      return { ...item, checked: e };
    });
    this.setState({ contents: newNewContents });
    this.triggerChange({ contents: newNewContents });
  };

  renderRateUnit = () => {
    const { rateUnit, disabled } = this.props;
    if (rateUnit.length === 1) {
      return rateUnit[0];
    }
    if (rateUnit.length > 1) {
      return (
        <Select disabled={disabled} style={{ width: 80 }}>
          {rateUnit.map((item) => (
            <Option value={item}>{item}</Option>
          ))}
        </Select>
      );
    }
    return '%';
  };

  renderRelation = (index, element, contents) => {
    const { disabled } = this.props;
    if (index === contents.length - 1) {
      return (
        <Select disabled={disabled} defaultValue="1">
          <Option style={{ fontWeight: 600 }} value="1">
            {element.checked && <span>≤X</span>}
            {!element.checked && <span>&#60;X</span>}
          </Option>
        </Select>
      );
    } else {
      return (
        <Select disabled={disabled} defaultValue="1">
          <Option style={{ fontWeight: 600 }} value="1">
            {element.checked && <span>≤X&#60;</span>}
            {!element.checked && <span>&#60;X≤</span>}
          </Option>
        </Select>
      );
    }
  };

  render() {
    const { sectionUnit, title, disabled, id } = this.props;
    const { contents } = this.state;
    const actions = (
      <div>
        分段单位：{' '}
        <Select disabled={disabled} style={{ width: 80 }} value={sectionUnit.length > 0 ? sectionUnit[0] : ''}>
          {sectionUnit.map((item) => (
            <Option value={item}>{item}</Option>
          ))}
        </Select>
        <Button
          disabled={disabled}
          size="small"
          style={{ marginLeft: 16 }}
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={() => this.handleAddLine()}
        />
      </div>
    );
    return (
      <div id={id}>
        <Card title={title} extra={actions} size="small">
          <Row style={{ textAlign: 'center', fontWeight: 600 }}>
            <Col span={6}>下限</Col>
            <Col span={5}>
              关系
              <Switch
                disabled={disabled}
                checked={_.get(contents, '0.checked')}
                onChange={this.handleRelationChange}
                checkedChildren="≤"
                unCheckedChildren="≥"
                size="small"
                defaultChecked
              />
            </Col>
            <Col span={6}>上限</Col>
            <Col span={6}>费率/比例</Col>
          </Row>
          {contents.map((element, index) => {
            return (
              <Row style={{ marginBottom: 16 }} gutter={16}>
                <Col span={6}>
                  <Input
                    type="number"
                    onChange={(e) => this.handleStartChange(e, index)}
                    value={element.start}
                    disabled
                  />
                </Col>
                <Col span={5}>{this.renderRelation(index, element, contents)}</Col>
                <Col span={6}>
                  {index !== contents.length - 1 && (
                    <Input
                      type="number"
                      disabled={disabled}
                      onChange={(e) => this.handleEndChange(e, index)}
                      value={element.end}
                    />
                  )}
                </Col>
                <Col span={6}>
                  <Input
                    type="number"
                    disabled={disabled}
                    onChange={(e) => this.handleRateChange(e, index)}
                    value={element.rate}
                    style={{ top: 0 }}
                    addonAfter={this.renderRateUnit()}
                  />
                </Col>
                <Col span={1}>
                  {index > 1 && (
                    <MinusCircleOutlined
                      style={{ fontSize: 16, lineHeight: 2, color: 'red' }}
                      onClick={() => (disabled ? null : this.handleDeleteLine(index))}
                    />
                  )}
                </Col>
              </Row>
            );
          })}
        </Card>
      </div>
    );
  }
}
