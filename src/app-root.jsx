import React from 'react';

import Sounds from './sounds.js';
import Grid from './grid.jsx';
import Info from './info.jsx';
import Settings from './settings.jsx';

import jlpt5 from '../data/jlpt5.json';
import jlpt4 from '../data/jlpt4.json';
import jlpt3 from '../data/jlpt3.json';
import jlpt2 from '../data/jlpt2.json';

const wordLists = {
  jlpt5,
  jlpt4,
  jlpt3,
  jlpt2
};

const wordLengthDistributions = [
  {
    4: 1,
    3: 1,
    2: 7,
    1: 4
  }, {
    3: 2,
    2: 8,
    1: 3
  }, {
    3: 1,
    2: 10,
    1: 2
  }, {
    2: 11,
    1: 3
  }, {
    2: 12,
    1: 1
  }
];

const storageKey = 'kanji-press';

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const shuffle = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * arr.length);
    [ arr[i], arr[j] ] = [ arr[j], arr[i] ];
  }
  return arr;
};

const speakWord = (word) => {
  const lang = 'ja-JP';

  let speech = new window.SpeechSynthesisUtterance();
  speech.text = word
  speech.lang = lang;
  speech.rate = 0.75;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
};


export default class AppRoot extends React.Component {
  constructor() {
    super();

    let savedState = localStorage.getItem(storageKey);

    if (savedState) {
      this.state = JSON.parse(savedState);
    } else {
      this.state = {
        levels: {
          jlpt5: true,
          jlpt4: false,
          jlpt3: false,
          jlpt2: false
        }
      };
    }

    Object.assign(this.state, this.getFreshState());

    this._onSelect = this.onSelect.bind(this);
    this._onLevelSelect = this.onLevelSelect.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.levels != this.state.levels) {
      localStorage.setItem(storageKey, JSON.stringify({ levels: this.state.levels }));
    }
  }

  getWords() {
    let data = Object.keys(this.state.levels)
      .filter((key) => this.state.levels[key])
      .reduce((acc, key) => acc.concat(wordLists[key]), []);

    if (!data.length) return this.state.words;

    let distribution = getRandom(wordLengthDistributions);

    let words = Object.keys(distribution)
      .reduce((acc, key) => {
        const retries = 10;
        let filteredWords = data.filter((item) => item[0].length == key);
        let times = distribution[key];
        let randomWords = [];

        for (let i = 0; i < times; i++) {
          for (let j = 0; j < retries; j++) {
            let word = getRandom(filteredWords);
            if (randomWords.indexOf(word) == -1) {
              randomWords.push(word);
              break;
            }
          }
        }

        return acc.concat(randomWords);
      }, []);

    return shuffle(words);
  }

  getFreshState() {
    return {
      words: this.getWords(),
      correctCount: 0,
      incorrectCount: 0,
      currentWordIndex: 0,
      activeItems: []
    };
  }

  isFinished() {
    let currentWordIndex = this.state.currentWordIndex;
    return (this.state.correctCount != this.state.words[currentWordIndex][0].length) &&
      (currentWordIndex + 1 >= this.state.words.length);
  }

  setStateIncorrect() {
    this.setState({
      incorrectCount: this.state.incorrectCount + 1
    });

    Sounds.playWrong();
  }

  setStateCorrect(item) {
    this.setState({
      correctCount: this.state.correctCount + 1,
      activeItems: this.state.activeItems.concat([ item ])
    });

    Sounds.playRight();
  }

  setStateNext() {
    let newState = {
      correctCount: 0,
      incorrectCount: 0,
      currentWordIndex: this.state.currentWordIndex + 1
    };

    setTimeout(() => this.setState(newState), 1500);

    setTimeout(() => speakWord(this.state.words[this.state.currentWordIndex][1]), 300);
  }

  setStateReset() {
    let newState = this.getFreshState();

    setTimeout(() => this.setState(newState), 5000);

    setTimeout(() => Sounds.playTada(), 1000);
  }

  onSelect(item) {
    let currentWord = this.state.words[this.state.currentWordIndex];
    let correctCount = this.state.correctCount;

    if (item.info != currentWord || item.index != correctCount) {
      this.setStateIncorrect();
      return;
    }

    this.setStateCorrect(item);

    if (correctCount + 1 != currentWord[0].length) return;

    if (this.isFinished()) {
      this.setStateReset();
      return;
    }

    this.setStateNext();
  }

  onLevelSelect(level, value) {
    let levels = Object.assign({}, this.state.levels);
    levels[level] = value;
    let newState = Object.assign({ levels: levels }, this.getFreshState());
    this.setState(newState);
  }

  render() {
    let currentWord = this.state.words[this.state.currentWordIndex];
    let isCorrect = this.state.correctCount == currentWord[0].length;
    let isFinished = isCorrect && this.state.currentWordIndex == this.state.words.length - 1;
    let hint = this.state.incorrectCount > 0 ? currentWord[1] : '';
    if (isCorrect) hint = currentWord[0];

    return (
      <div className="kanji-app">
        <Info task={ currentWord[2] }
              hint={ hint }
              correct={ isCorrect }
              finished={ isFinished }/>

        <Grid words={ this.state.words }
              doneItems={ this.state.activeItems }
              onSelect={ this._onSelect } />

        <Settings levels={ this.state.levels } onLevelSelect={ this._onLevelSelect } />
      </div>
    );
  }
}
