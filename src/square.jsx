import React from 'react';

const getRandomColor = () => `hsl(${ ~~(Math.random() * 255) }, ${ 30 + ~~(Math.random() * 20) }%, ${ 60 + ~~(Math.random() * 20) }%)`;

export default class Square extends React.Component {
  constructor(props) {
    super(props);

    this.state = { color: getRandomColor() };
  }

  onClick(e) {
    e.preventDefault();
    if (this.props.isDone) return;
    this.props.onSelect(this.props.item);
  }

  render() {
    let style = {
      background: this.props.isDone ? this.props.item.color : '',
      borderColor: this.state.color
    };

    return (
      <div className={ 'kanji-square' + (this.props.isDone ? ' kanji-square__done' : '') }
           onClick={ this.onClick.bind(this) }>
        <span style={ style }>{ this.props.item.symbol }</span>
      </div>
    );
  }
}
