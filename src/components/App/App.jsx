import React from 'react';
import classnames from 'classnames';
import Storage from '../../services/storage.js';
import Sounds from '../../services/sounds.js';
import Speech from '../../services/speech.js';
import WordLists from '../../services/word-lists.js';
import { randomItem, shuffle } from '../../services/utils.js';
import Grid from '../Grid/Grid.jsx';
import Info from '../Info/Info.jsx';
import Cover from '../Cover/Cover.jsx';
import Settings from '../Settings/Settings.jsx';
import HomeScreenBubble from '../HomeScreenBubble/HomeScreenBubble.jsx';
import styles from './App.css';


const storage = new Storage('kanji-press');

const wordLengthDistributions = [
  { 4: 1, 2: 9, 1: 3 },
  { 3: 2, 2: 8, 1: 3 },
  { 3: 1, 2: 10, 1: 2 },
  { 2: 11, 1: 3 },
  { 2: 12, 1: 1 }
];


export default class App extends React.PureComponent {
  constructor() {
    super();

    this.state = storage.get() || {
      isMute: false,

      levels: {
        jlpt5: true,
        jlpt4: false,
        jlpt3: false,
        jlpt2: false
      }
    };

    Object.assign(this.state, this.getFreshState());

    this._onSelect = this.onSelect.bind(this);
    this._onLevelSelect = this.onLevelSelect.bind(this);
    this._onMute = this.onMute.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.levels != this.state.levels || prevState.isMute != this.state.isMute) {
      storage.set({
        isMute: this.state.isMute,
        levels: this.state.levels
      });
    }
  }

  getWords() {
    const data = WordLists.get(this.state.levels);

    if (!data.length) return this.state.words;

    const distribution = randomItem(wordLengthDistributions);

    const words = Object.keys(distribution)
      .reduce((acc, key) => {
        const retries = 10;
        const filteredWords = data.filter((item) => item.word.length == key);
        const times = distribution[key];
        const randomWords = [];

        for (let i = 0; i < times; i++) {
          for (let j = 0; j < retries; j++) {
            const word = randomItem(filteredWords);
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
      doneItems: [],
      showHomeScreenMsg: false
    };
  }

  isFinished() {
    return this.state.currentWordIndex + 1 >= this.state.words.length;
  }

  speakWord() {
    if (this.state.isMute) return;

    const item = this.state.words[this.state.currentWordIndex];
    setTimeout(() => Speech(item.word), 100);
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
      doneItems: this.state.doneItems.concat([ item ])
    });

    !this.state.isMute && Sounds.playRight();
  }

  setStateNext() {
    const newState = {
      correctCount: 0,
      incorrectCount: 0,
      currentWordIndex: this.state.currentWordIndex + 1
    };

    setTimeout(() => this.setState(newState), 1500);
  }

  setStateReset() {
    const newState = this.getFreshState();

    newState.showHomeScreenMsg = true;

    setTimeout(() => this.setState(newState), 5000);

    !this.state.isMute && setTimeout(() => Sounds.playTada(), 1000);
  }

  onSelect(item) {
    const currentWord = this.state.words[this.state.currentWordIndex];
    const correctCount = this.state.correctCount;

    if (item.symbol != currentWord.word.charAt(correctCount)) {
      this.setStateIncorrect();
      return;
    }

    this.setStateCorrect(item);

    if (correctCount + 1 != currentWord.word.length) return;

    this.speakWord();

    if (this.isFinished()) {
      this.setStateReset();
      return;
    }

    this.setStateNext();
  }

  onLevelSelect(level, value) {
    this.state.levels[level] = value;

    const keys = Object.keys(this.state.levels);
    const isAllOff = keys.every((key) => !this.state.levels[key])
    if (isAllOff) {
      this.state.levels[keys[0]] = true;
    }

    const newState = Object.assign({ levels: this.state.levels }, this.getFreshState());
    this.setState(newState);
  }

  onMute() {
    this.setState({ isMute: !this.state.isMute });
  }

  render() {
    const currentWord = this.state.words[this.state.currentWordIndex];
    const isCorrect = this.state.correctCount == currentWord.word.length;
    const isReset = isCorrect && this.isFinished();

    const classes = classnames(styles.app, {
      [styles.appRestart]: isReset
    });

    return (
      <div className={ classes }>
        <div className={ styles.top }>
          <Info item={ currentWord }
                showHint={ this.state.incorrectCount > 0 }
                showAnswer={ this.state.incorrectCount > 2 }
                isCorrect={ isCorrect } />

            { isReset ? <Cover /> : '' }
        </div>

        <div className={ styles.main }>
          <Grid words={ this.state.words }
                currentWordIndex={ this.state.currentWordIndex }
                doneItems={ this.state.doneItems }
                onSelect={ this._onSelect } />
        </div>

        <Settings
          levels={ this.state.levels } onLevelSelect={ this._onLevelSelect }
          isMute={ this.state.isMute } onMute={ this._onMute } />

        <HomeScreenBubble visible={ this.state.showHomeScreenMsg } />
      </div>
    );
  }
}
