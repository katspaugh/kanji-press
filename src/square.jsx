import React from 'react';

const getRandomColor = () => `hsl(${ ~~(Math.random() * 255) }, ${ 30 + ~~(Math.random() * 20) }%, ${ 60 + ~~(Math.random() * 20) }%)`;

export default class Square extends React.Component {
  constructor(props) {
    super(props);

    this.randomColor = getRandomColor();

    this._onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    if (this.props.isDone) return;
    this.props.onSelect(this.props.item);
  }

  render() {
    let item = this.props.item;

    let style = {
      backgroundColor: this.props.isDone ? item.color : '',
      borderColor: this.randomColor,
      pointerEvents: this.props.isDone ? 'none' : ''
    };

    return (
      <div className={ 'kanji-square' + (this.props.isDone ? ' kanji-square__done' : '') }
           onClick={ this._onClick }>
        <span style={ style }>{ item.symbol }</span>
      </div>
    );
  }
}
