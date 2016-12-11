import React from 'react';

import packings from './packings.js';
import Square from './square.jsx';


const packingKeys = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l' ]
  .reduce((acc, key) => {
    acc[key] = packings[0].match(new RegExp(key, 'g')).length;
    return acc;
  }, {});

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomColor = () => `hsl(${ ~~(Math.random() * 255) }, ${ 30 + ~~(Math.random() * 20) }%, ${ 60 + ~~(Math.random() * 20) }%)`;


export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: this.getGrid(props.words)
    };
  }

  getGrid(words) {
    let grid = [];
    let packing = getRandom(packings).replace(/\s/g, '');

    let wordsByLength = words.reduce((acc, word) => {
      let length = word[0].length;
      if (!(length in acc)) acc[length] = [];
      acc[length].push(word);
      return acc;
    }, {});

    for (let key in packingKeys) {
      let length = packingKeys[key];
      let word = wordsByLength[length].shift();
      let color = getRandomColor();
      let count = 0;

      let symbols = word[0].split('').map((s, i) => {
        return {
          symbol: s,
          index: i,
          info: word,
          color: color
        }
      });

      // Scramble two-kanji compounds
      if (symbols.length == 2) symbols.reverse();

      packing.replace(new RegExp(key, 'g'), (s, index) => {
        grid[index] = symbols[count];
        count += 1;
      });
    }

    return grid;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.words != this.props.words) {
      this.setState({ grid: this.getGrid(nextProps.words) });
    }
  }

  render() {
    let squares = this.state.grid.map((item, i) => {
      let isDone = this.props.doneItems.indexOf(item) > -1;

      return (
        <Square key={ 'square-' + i }
                item={ item }
                isDone={ isDone }
                onSelect={ this.props.onSelect } />
      );
    });

    return (
      <div className="kanji-main">
        <div className="kanji-grid">{ squares }</div>
      </div>
    );
  }
}
