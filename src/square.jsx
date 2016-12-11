import React from 'react';

const getRandomColor = () => `hsl(${ ~~(Math.random() * 255) }, ${ 30 + ~~(Math.random() * 20) }%, ${ 60 + ~~(Math.random() * 20) }%)`;

export default class Square extends React.Component {
  constructor(props) {
    super(props);

    this.state = { color: getRandomColor(), altColor: getRandomColor() };
  }

  onClick(e) {
    e.preventDefault();
    if (this.props.isDone) return;
    this.props.onSelect(this.props.item);
  }

  render() {
    let item = this.props.item;

    let style = {
      background: this.props.isDone ? item.color : '',
      borderImage: `linear-gradient(to top left, ${ this.state.color }, ${ this.state.altColor }) 1`
    };

    return (
      <div className={ 'kanji-square' + (this.props.isDone ? ' kanji-square__done' : '') }
           onClick={ this.onClick.bind(this) }>
        <span style={ style }>{ item.symbol }</span>
      </div>
    );
  }
}
