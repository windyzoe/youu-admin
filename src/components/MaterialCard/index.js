import React from 'react';
import styles from './index.less';
/**
 * 
 * @param {headColor} 颜色 Lime|Geekblue|Cyan|Gold
 */
const MaterialCard = ({ children, header, headColor }) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.header} ${styles[`headerColor${headColor}`]}`}>{header}</div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default MaterialCard;
