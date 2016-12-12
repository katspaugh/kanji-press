import React from 'react';

import Square from './square.jsx';


const squaresCount = 25;

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomColor = () => `hsl(${ ~~(Math.random() * 255) }, ${ 30 + ~~(Math.random() * 20) }%, ${ 60 + ~~(Math.random() * 20) }%)`;


export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: this.getGrid(props.words)
    };
  }

  getSymbols(word) {
    let color = getRandomColor();

    let symbols = word[0].split('').map((char, index) => {
      return {
        symbol: char,
        index: index,
        info: word,
        color: color
      };
    });

    return symbols;
  }

  addToGrid(grid, symbols) {
    const gridSize = Math.sqrt(squaresCount);

    let emptyIndeces = grid.reduce((acc, val, index) => {
      if (val == null) acc.push(index);
      return acc;
    }, []);

    let startIndex = getRandom(emptyIndeces);

    symbols.reduce((prevIndex, sym) => {
      grid[prevIndex] = sym;

      let possibleSteps;

      // Left-most column
      if ((prevIndex + 1) % gridSize == 1) {
        possibleSteps = [ -5, -4, 1, 5, 6 ];
      // Right-most column
      } else if ((prevIndex + 1) % gridSize == 0) {
        possibleSteps = [ -6, -5, -1, 4, 5 ];
      } else {
        possibleSteps = [ -6, -5, -4, -1, 1, 4, 5, 6 ];
      }

      possibleSteps = possibleSteps.filter((n) => prevIndex + n >= 0 && prevIndex + n < squaresCount);

      // Determine a square for the next symbol
      let nextIndex = prevIndex;
      while (possibleSteps.length && grid[nextIndex] != null) {
        let stepIndex = Math.floor(Math.random() * possibleSteps.length);
        nextIndex = prevIndex + possibleSteps[stepIndex];
        possibleSteps.splice(stepIndex, 1);
      }

      if (grid[nextIndex] != null) nextIndex = grid.indexOf(null);

      return nextIndex;
    }, startIndex);
  }

  getGrid(words) {
    let grid = [];
    for (let i = 0; i < squaresCount; i++) grid.push(null);

    words.slice()
      .sort((a, b) => b[0].length - a[0].length)
      .forEach((word) => {
        this.addToGrid(grid, this.getSymbols(word));
      });

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
