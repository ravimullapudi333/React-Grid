import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classNames';
import PropTypes from 'prop-types';

import './Grid.css';
// Generic hook for detecting scroll:
const useScrollAware = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();

  const onScroll = e =>
    requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
    });

  useEffect(() => {
    const scrollContainer = ref.current;

    setScrollTop(scrollContainer.scrollTop);
    scrollContainer.addEventListener('scroll', onScroll);
    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, []);

  return [scrollTop, ref];
};

function Grid(props) {
  const [data, setData] = useState(props.data);
  const [columns, setColumns] = useState([]);

  const [scrollTop, ref] = useScrollAware();
  const totalHeight = props.itemCount * props.childHeight;

  let startNode = Math.floor(scrollTop / props.childHeight) - props.renderAhead;
  startNode = Math.max(0, startNode);

  let visibleNodeCount = Math.ceil(props.height / props.childHeight) + 2 * props.renderAhead;
  visibleNodeCount = Math.min(props.itemCount - startNode, visibleNodeCount);

  const offsetY = startNode * props.childHeight;

  React.useEffect(() => {
    const sortedCols = props.colDefs.sort((a, b) => b.pinned - a.pinned);
    setColumns(sortedCols);
    console.log(columns);
  }, []);

  const arrayMove = (arr, fromIndex, toIndex) => {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  };

  const onDragOver = ev => {
    ev.preventDefault();
  };

  const onDragStart = (ev, id) => {
    ev.dataTransfer.setData('col', JSON.stringify(id));
  };

  const onDrop = (ev, cat) => {
    if (!ev.target.classList.contains('sticky-col')) {
      let selectedCol = JSON.parse(ev.dataTransfer.getData('col'));
      let targetCol = ev.target.innerText;
      let targetColId;
      let selectedColId;
      columns.forEach((col, i) => {
        if (col.headerName === selectedCol.headerName) {
          selectedColId = i;
        }
        if (col.headerName === targetCol) {
          targetColId = i;
        }
      });
      const cols = JSON.parse(JSON.stringify(columns));
      arrayMove(cols, selectedColId, targetColId);
      // [cols[selectedColId], cols[targetColId]] = [cols[targetColId], cols[selectedColId]];
      setColumns(cols);
    } else {
      console.warn('Target column is pinned , we cannot reorder the selected column');
    }
  };

  const getColLeft = colIndex => {
    let left = 0;
    for (let i = 0; i < colIndex; i++) {
      left = left + columns[i].width;
    }
    return left;
  };
  return (
    <div style={{ height: props.height }} className="wrapper" ref={ref}>
      <div
        style={{
          willChange: 'transform',
          height: totalHeight,
          position: 'relative'
        }}
      >
        <table onScroll={ev => console.log(ev)} id="tableGrid">
          <thead
            onDragOver={ev => onDragOver(ev)}
            className="header-style"
            onDrop={e => onDrop(e, 'complete')}
          >
            <tr>
              {columns &&
                columns.map((col, index) => {
                  return (
                    <th
                      style={{
                        width: col.width,
                        maxWidth: col.width,
                        minWidth: col.width,
                        left: col.pinned && getColLeft(index)
                      }}
                      className={classNames({
                        'sticky-col': col.pinned
                      })}
                      key={col.colId}
                      onDragStart={e => onDragStart(e, col)}
                      draggable={col.draggable && !col.pinned}
                    >
                      {col.headerName}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody
            style={{
              willChange: 'transform',
              transform: `translateY(${offsetY}px)`
            }}
          >
            {useMemo(
              () =>
                data
                  .slice(
                    startNode + visibleNodeCount,
                    startNode + visibleNodeCount + visibleNodeCount
                  )
                  .map((d, i) => {
                    console.log('count ===>', visibleNodeCount, startNode);
                    return (
                      <tr key={i}>
                        {columns &&
                          columns.map((col, j) => {
                            return (
                              <td
                                key={j}
                                style={{
                                  width: col.width,
                                  maxWidth: col.width,
                                  minWidth: col.width,
                                  left: col.pinned && getColLeft(j)
                                }}
                                className={classNames({
                                  'sticky-col': col.pinned
                                })}
                              >
                                {d[col.colId]}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  }),
              [startNode, visibleNodeCount, columns]
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
Grid.prototypes = {
  itemCount: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  childHeight: PropTypes.number.isRequired,
  renderAhead: PropTypes.number.isRequired,
  colDefs: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
};

export default Grid;
