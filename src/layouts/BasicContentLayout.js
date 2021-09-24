import React from 'react';
import { Form, Button } from 'antd';
import { useSelector } from 'dva';
// import PageLoading from 'components/PageLoading';
import styles from './BasicContentLayout.less';

/**
 * 通用布局，就一个白板
 *
 * @param {*} { children, ...restProps }
 */
const BasicContentLayout = ({ children, loading, ...restProps }) => {
  const tabPage = useSelector((state) => state.global.tabPage);
  return (
    <div className={styles.root} style={tabPage ? { backgroundColor: 'transparent', boxShadow: 'none' } : null}>
      {loading && <span>loading</span>}
      {children && !loading ? (
        <div className={styles.content} style={tabPage ? { padding: 0 } : null}>
          {children}
        </div>
      ) : null}
    </div>
  );
};
export default BasicContentLayout;
