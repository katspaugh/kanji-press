import React from 'react';
import { randomColor, randomItem } from '../../services/utils.js';
import Square from '../Square/Square.jsx';
import styles from './Grid.css';

const squaresCount = 25;


export default class Grid extends React.PureComponent {
  constructor(props) {
    super(props);

    this.colors = props.words.map(randomColor);
    this.state = { grid: this.getGrid(props.words) };
  }

  addToGrid(grid, symbols) {
    const gridSize = Math.sqrt(squaresCount);

    let emptyIndeces = grid.reduce((acc, val, index) => {
      if (val == null) acc.push(index);
      return acc;
    }, []);

    let startIndex = randomItem(emptyIndeces);

    symbols.reduce((prevIndex, symbol) => {
      grid[prevIndex] = { symbol };

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
      .sort((a, b) => b.word.length - a.word.length)
      .forEach((word) => {
        this.addToGrid(grid, word.word.split(''));
      });

    return grid;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.words !== this.props.words) {
      this.colors = nextProps.words.map(randomColor);
      this.setState({ grid: this.getGrid(nextProps.words) });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.words !== this.props.words ||
      nextProps.doneItems !== this.props.doneItems;
  }

  render() {
    let squares = this.state.grid.map((item, i) => {
      const isDone = this.props.doneItems.indexOf(item) > -1;
      const color = this.colors[this.props.currentWordIndex];

      return (
        <Square key={ i }
                item={ item }
                color={ color }
                isDone={ isDone }
                onSelect={ this.props.onSelect } />
      );
    });

    return (
      <div className={ styles.grid }>{ squares }</div>
    );
  }
}
