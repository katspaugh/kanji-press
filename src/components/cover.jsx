import React from 'react';
import { random } from '../services/utils.js';
import styles from '../css/cover.css';

const backgrounds = [
  '/src/assets/images/cover-1.gif',
  '/src/assets/images/cover-2.gif',
  '/src/assets/images/cover-3.gif'
];

export default class Cover extends React.PureComponent {
  render() {
    const style = {
      backgroundImage: `url(${ random(backgrounds) })`
    };

    return (
      <div className={ styles.cover } style={ style }></div>
    );
  }
}
