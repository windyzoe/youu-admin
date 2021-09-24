import React, { useContext, useEffect, useRef } from 'react';
import {
  SettingOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Checkbox, Tree, Popover, ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import DragIcon from './DragIcon';
import { TableContext } from '../TableContext';
import { genColumnKey } from '../utils';

const ToolTipIcon = ({ title, show, children, columnKey, fixed }) => {
  const { columnsSet, setColumnsSet } = useContext(TableContext);
  if (!show) {
    return null;
  }
  return (
    <Tooltip title={title}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const config = columnsSet[columnKey] || {};
          const columnKeyMap = {
            ...columnsSet,
            [columnKey]: { ...config, fixed },
          };
          setColumnsSet(columnKeyMap);
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
};

const CheckboxListItem = ({ columnKey, title, className, fixed }) => {
  return (
    <span className={`${className}-list-item`} key={columnKey}>
      <div className={`${className}-list-item-title`}>{title}</div>
      <span className={`${className}-list-item-option`}>
        <ToolTipIcon columnKey={columnKey} fixed="left" title="固定在列首" show={fixed !== 'left'}>
          <VerticalAlignTopOutlined />
        </ToolTipIcon>
        <ToolTipIcon columnKey={columnKey} fixed={undefined} title="不固定" show={!!fixed}>
          <VerticalAlignMiddleOutlined />
        </ToolTipIcon>
        <ToolTipIcon columnKey={columnKey} fixed="right" title="固定在列尾" show={fixed !== 'right'}>
          <VerticalAlignBottomOutlined />
        </ToolTipIcon>
      </span>
    </span>
  );
};

const CheckboxList = ({ list, draggable, checkable, className, showTitle = true, title: listTitle }) => {
  const { columnsSet, setColumnsSet, columnSortKeys, setColumnSortKeys } = useContext(TableContext);
  const show = list && list.length > 0;
  if (!show) {
    return null;
  }
  const move = (id, targetId, dropPosition) => {
    const newMap = { ...columnsSet };
    const newColumns = [...columnSortKeys.current]; //columnSortKeys主要还是在这里做个缓存
    const findIndex = newColumns.findIndex((columnKey) => columnKey === id);
    const targetIndex = newColumns.findIndex((columnKey) => columnKey === targetId);
    const isDownWord = dropPosition > findIndex;
    if (findIndex < 0) {
      return;
    }
    const targetItem = newColumns[findIndex];
    newColumns.splice(findIndex, 1);
    if (dropPosition === 0) {
      newColumns.unshift(targetItem);
    } else {
      newColumns.splice(isDownWord ? targetIndex : targetIndex + 1, 0, targetItem);
    }
    // 重新生成排序数组
    newColumns.forEach((key, order) => {
      newMap[key] = { ...(newMap[key] || {}), order };
    });
    // 更新数组
    setColumnsSet(newMap);
    setColumnSortKeys(newColumns);
  };

  const checkedKeys = [];

  const treeData = list.map(({ key, dataIndex, ...rest }) => {
    const columnKey = genColumnKey(key, rest.index);
    const config = columnsSet[columnKey || 'null'] || { show: true };
    if (config.show !== false) {
      checkedKeys.push(columnKey);
    }
    return {
      key: columnKey,
      ...rest,
      selectable: false,
      switcherIcon: <DragIcon />,
    };
  });

  const listDom = (
    <Tree
      itemHeight={24}
      draggable={draggable}
      checkable={checkable}
      onDrop={(info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const { dropPosition, dropToGap } = info;
        const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition;
        move(dragKey, dropKey, position);
      }}
      blockNode
      onCheck={(_, e) => {
        const columnKey = e.node.key;
        const tempConfig = columnsSet[columnKey] || {};
        const newSetting = { ...tempConfig };
        if (e.checked) {
          delete newSetting.show;
        } else {
          newSetting.show = false;
        }
        const columnKeyMap = {
          ...columnsSet,
          [columnKey]: newSetting,
        };
        // 如果没有值了，直接干掉他
        if (Object.keys(newSetting).length === 0) {
          delete columnKeyMap[columnKey];
        }
        setColumnsSet(columnKeyMap);
      }}
      checkedKeys={checkedKeys}
      showLine={false}
      titleRender={(node) => {
        return <CheckboxListItem className={className} {...node} columnKey={node.key} />;
      }}
      height={280}
      treeData={treeData}
    />
  );
  return (
    <>
      {showTitle && <span className={`${className}-list-title`}>{listTitle}</span>}
      {listDom}
    </>
  );
};

const GroupCheckboxList = ({ localColumns, className, draggable, checkable }) => {
  const rightList = [];
  const leftList = [];
  const list = [];

  localColumns.forEach((item) => {
    const { fixed } = item;
    if (fixed === 'left') {
      leftList.push(item);
      return;
    }
    if (fixed === 'right') {
      rightList.push(item);
      return;
    }

    /** 不在 setting 中展示的 */
    if (item.hideInSetting) {
      return;
    }
    list.push(item);
  });

  const showRight = rightList && rightList.length > 0;
  const showLeft = leftList && leftList.length > 0;
  return (
    <div
      className={classNames(`${className}-list`, {
        [`${className}-list-group`]: showRight || showLeft,
      })}
    >
      <CheckboxList
        title="固定在左侧"
        list={leftList}
        draggable={draggable}
        checkable={checkable}
        className={className}
      />
      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        list={list}
        draggable={draggable}
        checkable={checkable}
        title="不固定"
        showTitle={showLeft || showRight}
        className={className}
      />
      <CheckboxList
        title="固定在右侧"
        list={rightList}
        draggable={draggable}
        checkable={checkable}
        className={className}
      />
    </div>
  );
};

function ColumnSetting(props) {
  const { columns: localColumns, checkable, draggable } = props;
  const columnRef = useRef({});
  const { columnsSet, setColumnsSet, setColumnSortKeys } = useContext(TableContext);
  useEffect(() => {
    if (columnsSet) {
      columnRef.current = JSON.parse(JSON.stringify(columnsSet));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 设置全部选中，或全部未选中
   *
   * @param show
   */
  const setAllSelectAction = (show = true) => {
    const columnKeyMap = {};
    localColumns.forEach(({ key, fixed, index, ...rest }) => {
      const columnKey = genColumnKey(key, index);
      if (columnKey) {
        columnKeyMap[columnKey] = {
          ...rest,
          show,
          fixed,
        };
      }
    });
    setColumnsSet(columnKeyMap);
  };

  // 选中的 key 列表
  const selectedKeys = Object.values(columnsSet).filter((value) => !value || value.show === false);

  // 是否已经选中
  const indeterminate = selectedKeys.length > 0 && selectedKeys.length !== localColumns.length;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const className = getPrefixCls('pro-table-column-setting');

  return (
    <Popover
      arrowPointAtCenter
      title={
        <div className={`${className}-title`}>
          <Checkbox
            indeterminate={indeterminate}
            checked={selectedKeys.length === 0 && selectedKeys.length !== localColumns.length}
            onChange={(e) => {
              if (e.target.checked) {
                setAllSelectAction();
              } else {
                setAllSelectAction(false);
              }
            }}
          >
            列展示
          </Checkbox>
          <a
            onClick={() => {
              setColumnSortKeys(Object.keys(columnRef.current));
              setColumnsSet(columnRef.current);
            }}
          >
            重置
          </a>
        </div>
      }
      overlayClassName={styles.columnSetting}
      trigger="click"
      placement="bottomRight"
      content={
        <GroupCheckboxList
          checkable={checkable ?? true}
          draggable={draggable ?? true}
          className={className}
          localColumns={localColumns}
        />
      }
    >
      <Tooltip title="列设置">
        <SettingOutlined />
      </Tooltip>
    </Popover>
  );
}

export default ColumnSetting;
