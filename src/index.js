import React from 'react';
import ReactDOM from 'react-dom';

import Grid from './components/Grid.jsx';
import './index.scss';

import sampleData from './data.json';

const colDefs = [
  { headerName: 'Date', colId: 'date', width: 80, pinned: false, draggable: true },
  { headerName: 'Athlete', colId: 'athlete', width: 80, pinned: false, draggable: true },
  { headerName: 'Age', colId: 'age', width: 80, pinned: true, draggable: true },
  { headerName: 'Country', colId: 'country', width: 80, pinned: true, draggable: true },
  { headerName: 'Year', colId: 'year', width: 80, pinned: false, draggable: true },
  { headerName: 'Sport', colId: 'sport', width: 80, pinned: false, draggable: true },
  { headerName: 'Gold', colId: 'gold', width: 80, pinned: false, draggable: true },
  { headerName: 'Silver', colId: 'silver', width: 80, pinned: false, draggable: true },
  { headerName: 'Bronze', colId: 'bronze', width: 80, pinned: false, draggable: true },
  { headerName: 'Total', colId: 'total', width: 80, pinned: false, draggable: true }
];
const dataCount = sampleData.length;
ReactDOM.render(
  <div className="main">
    <Grid
      itemCount={dataCount}
      height={750}
      childHeight={30}
      renderAhead={6}
      colDefs={colDefs}
      data={sampleData}
    />
  </div>,
  document.getElementById('root')
);
