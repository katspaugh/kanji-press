import React from 'react';
import { randomColor } from '../services/utils.js';

export default class Square extends React.Component {
  constructor(props) {
    super(props);

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

  shouldComponentUpdate(nextProps) {
    return nextProps.isDone !== this.props.isDone || nextProps.item !== this.props.item;
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

    return (
      <div className={ 'kanji-square' + (this.props.isDone ? ' kanji-square__done' : '') }
           onMouseDown={ this._onClick }>
        <span style={ style }>{ this.props.item.symbol }</span>
      </div>
    );
  }
}
