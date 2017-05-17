import React from 'react';
import classnames from 'classnames';
import { randomColor } from '../../services/utils.js';
import styles from './Square.css';

export default class Square extends React.PureComponent {
  constructor() {
    super();

    this.style = {
      borderColor: randomColor()
    };

    this._onClick = (e) => this.onClick(e);
  }

  onClick(e) {
    e.preventDefault();
    if (this.props.isDone) return;
    this.props.onSelect(this.props.item);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.style = {
        borderColor: randomColor()
      };
    }
  }

  render() {
    const style = this.props.isDone ?
          Object.assign({ backgroundColor: this.props.color }, this.style) :
          this.style;

    const classes = classnames(styles.square, {
      [styles.squareDone]: this.props.isDone
    });

    return (
      <div className={ classes } onMouseDown={ this._onClick }>
        <span style={ style }>{ this.props.item.symbol }</span>
      </div>
    );
  }
}
