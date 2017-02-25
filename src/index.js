import React from 'react';
import ReactDOM from 'react-dom';
import AppRoot from './components/app-root.jsx';

ReactDOM.render(
  React.createElement(AppRoot),
  document.querySelector('#app-root')
);

document.addEventListener('touchmove', (e) => e.preventDefault(), false);
