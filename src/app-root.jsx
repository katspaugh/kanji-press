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
  jlpt5: jlpt5,
  jlpt4: jlpt4,
  jlpt3: jlpt3,
  jlpt2: jlpt2
};

const squaresCount = 25;

const wordLengthDistribution = {
  4: 1,
  3: 1,
  2: 8,
  1: 2
};

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

  setTimeout(() => {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }, 300);
};


export default class AppRoot extends React.Component {
  constructor() {
    super();

    let savedState = localStorage.getItem('kanji-press');

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
  }

  componentDidUpdate() {
    let stateToSave = { levels: this.state.levels };
    localStorage.setItem('kanji-press', JSON.stringify(stateToSave));
  }

  getWords() {
    let data = [];

    for (let key in this.state.levels) {
      if (this.state.levels[key]) {
        data = data.concat(wordLists[key]);
      }
    }

    if (!data.length) {
      return this.state.words;
    }

    let words = [];

    for (let length in wordLengthDistribution) {
      let filteredWords = data.filter((item) => item[0].length == length);
      let times = wordLengthDistribution[length];

      for (let i = 0; i < times; i++) {
        words.push(getRandom(filteredWords));
      }
    }

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

  onSelect(item) {
    let currentWordIndex = this.state.currentWordIndex;
    let currentWord = this.state.words[currentWordIndex];
    let currentWordText = currentWord[0];
    let correctCount = this.state.correctCount;
    let correctSymbol = currentWordText.charAt(correctCount);

    if (item.symbol != correctSymbol || item.info != currentWord || item.index != correctCount) {
      this.setState({
        incorrectCount: this.state.incorrectCount + 1
      });
      Sounds.playWrong();
      return;
    }

    Sounds.playRight();

    let activeItems = this.state.activeItems;
    correctCount += 1;
    activeItems = activeItems.concat([ item ]);

    // First, update the active item
    this.setState({
      correctCount: correctCount,
      activeItems: activeItems
    });

    if (correctCount != currentWordText.length) return;

    speakWord(currentWord[1]);

    // Update the rest of the state with a timeout
    let state, delay;

    if (this.isFinished()) {
      state = this.getFreshState();
      delay = 7000;
    } else {
      state = {
        correctCount: 0,
        incorrectCount: 0,
        currentWordIndex: currentWordIndex + 1
      };
      delay = 1500;
    }

    setTimeout(() => this.setState(state), delay);
  }

  onLevelSelect(level, value) {
    this.state.levels[level] = value;
    this.setState(this.getFreshState());
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
              onSelect={ this.onSelect.bind(this) } />

        <Settings levels={ this.state.levels } onLevelSelect={ this.onLevelSelect.bind(this) } />
      </div>
    );
  }
}
