
import React from 'react';

import Sounds from './sounds.js';
import Grid from './grid.jsx';
import Info from './info.jsx';
import Settings from './settings.jsx';
import HomeScreenBubble from './home-screen-bubble.jsx';

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
  { 4: 1, 2: 9, 1: 3 },
  { 3: 2, 2: 8, 1: 3 },
  { 3: 1, 2: 10, 1: 2 },
  { 2: 11, 1: 3 },
  { 2: 12, 1: 1 }
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

const speak = (text) => {
  const lang = 'ja-JP';
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang == lang);
  const speech = new window.SpeechSynthesisUtterance();

  if (voices.length > 1) {
    speech.voice = voices[1];
  }

  speech.text = text + '。';
  speech.lang = lang;
  speech.rate = 1;

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
        isMute: false,

        levels: {
          jlpt5: true,
          jlpt4: false,
          jlpt3: false,
          jlpt2: false
        }
      };
    }

    jlpt5.forEach(function(entry) {entry.push("N5")});
    jlpt4.forEach(function(entry) {entry.push("N4")});
    jlpt3.forEach(function(entry) {entry.push("N3")});
    jlpt2.forEach(function(entry) {entry.push("N2")});

    Object.assign(this.state, this.getFreshState());

    this._onSelect = this.onSelect.bind(this);
    this._onLevelSelect = this.onLevelSelect.bind(this);
    this._onMute = this.onMute.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.levels != this.state.levels || prevState.isMute != this.state.isMute) {
      localStorage.setItem(storageKey, JSON.stringify({
        isMute: this.state.isMute,
        levels: this.state.levels
      }));
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
      activeItems: [],
      showHomeScreenMsg: false
    };
  }

  isFinished() {
    return this.state.currentWordIndex + 1 >= this.state.words.length;
  }

  speakWord() {
    if (this.state.isMute) return;

    let item = this.state.words[this.state.currentWordIndex];
    let text = item[1];
    setTimeout(() => speak(text), 300);
  }

  setStateIncorrect() {
    this.setState({
      incorrectCount: this.state.incorrectCount + 1
    });

    !this.state.isMute && Sounds.playWrong();
  }

  setStateCorrect(item) {
    this.setState({
      correctCount: this.state.correctCount + 1,
      activeItems: this.state.activeItems.concat([ item ])
    });

    !this.state.isMute && Sounds.playRight();
  }

  setStateNext() {
    let newState = {
      correctCount: 0,
      incorrectCount: 0,
      currentWordIndex: this.state.currentWordIndex + 1
    };

    setTimeout(() => this.setState(newState), 1500);
  }

  setStateReset() {
    let newState = this.getFreshState();

    newState.showHomeScreenMsg = true;

    setTimeout(() => this.setState(newState), 5000);

    !this.state.isMute && setTimeout(() => Sounds.playTada(), 1000);
  }

  onSelect(item) {
    let currentWord = this.state.words[this.state.currentWordIndex];
    let correctCount = this.state.correctCount;

    if (item.symbol != currentWord[0].charAt(correctCount)) {
      this.setStateIncorrect();
      return;
    }

    this.setStateCorrect(item);

    if (correctCount + 1 != currentWord[0].length) return;

    this.speakWord();

    if (this.isFinished()) {
      this.setStateReset();
      return;
    }

    this.setStateNext();
  }

  onLevelSelect(level, value) {
    this.state.levels[level] = value;

    let isAllOff = Object.keys(this.state.levels).every((key) => !this.state.levels[key])
    if (isAllOff) {
      this.state.levels.jlpt5 = true;
    }

    let newState = Object.assign({ levels: this.state.levels }, this.getFreshState());
    this.setState(newState);
  }

  onMute() {
    this.setState({ isMute: !this.state.isMute });
  }

  render() {
    let currentWord = this.state.words[this.state.currentWordIndex];
    let isCorrect = this.state.correctCount == currentWord[0].length;
    let isFinished = isCorrect && this.isFinished();
    let showHint = this.state.incorrectCount > 0;
    let hint = this.state.incorrectCount > 2 ? currentWord[0] : currentWord[1];

    return (
      <div className="kanji-app">
        <Info task={ currentWord[2] }
              hint={ hint }
              answer={ currentWord[0] }
              reading={ currentWord[1] }
              level={ currentWord[3] }
              showHint={ showHint }
              correct={ isCorrect }
              finished={ isFinished }/>

        <Grid words={ this.state.words }
              currentWordIndex={ this.state.currentWordIndex }
              doneItems={ this.state.activeItems }
              onSelect={ this._onSelect } />

        <Settings
          levels={ this.state.levels } onLevelSelect={ this._onLevelSelect }
          isMute={ this.state.isMute } onMute={ this._onMute } />

        <HomeScreenBubble visible={ this.state.showHomeScreenMsg } />
      </div>
    );
  }
}
