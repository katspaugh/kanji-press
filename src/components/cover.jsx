import React from 'react';

import { random } from '../services/utils.js';

const backgrounds = [
  '/src/images/cover-1.gif',
  '/src/images/cover-2.gif',
  '/src/images/cover-3.gif'
];

export default class Cover extends React.Component {
  render() {
    const style = {
      backgroundImage: `url(${ random(backgrounds) })`
    };

    return (
      <div className="kanji-cover" style={ style }></div>
    );
  }
}
