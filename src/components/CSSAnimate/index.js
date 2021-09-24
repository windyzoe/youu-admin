import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
import cx from 'classnames';

class CSSAnimate extends PureComponent {
  static propTypes = {
    type: PropTypes.string, // 动画名称
    callback: PropTypes.func, // 动画结束的回调函数
    duration: PropTypes.number, // 动画持续时间
    delay: PropTypes.number, // 动画延时
  };

  componentDidMount() {
    const { type, callback } = this.props;
    this.animate(type, callback);
  }

  componentDidUpdate(prevProps, prevState) {
    const { type, callback } = this.props;
    this.animate(type, callback);
  }

  animate = (type, callback) => {
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    if (isCssAnimationSupported && type) {
      cssAnimate(node, type, callback);
    } else if (!isCssAnimationSupported) {
      console.warn('不支持css动画');
    }
  };

  render() {
    const { className, children, delay, duration, style, ...otherProps } = this.props;
    const classnames = cx('animated', className);
    const myStyle = { ...style };
    if (duration) {
      myStyle.animationDuration = `${duration}ms`;
      myStyle.WebkitAnimationDuration = `${duration}ms`;
    }
    if (delay) {
      myStyle.animationDelay = `${delay}ms`;
      myStyle.WebkitAnimationDelay = `${delay}ms`;
    }
    const { type, callback, ...divProps } = otherProps;
    return (
      <div className={classnames} {...divProps} style={myStyle}>
        {children}
      </div>
    );
  }
}

export default CSSAnimate;
