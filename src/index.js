import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';

ReactDOM.render(
  React.createElement(App),
  document.querySelector('#app-root')
);

document.addEventListener('touchmove', (e) => e.preventDefault(), false);
