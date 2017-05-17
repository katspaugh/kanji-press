import React from 'react';
import Storage from '../../services/storage.js';
import Popup from '../Popup/Popup.jsx';
import styles from './HomeScreenBubble.css';


const storage = new Storage('kanji-press-home-screen-msg');

export default class HomeScreenBubble extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { closed: false };
    this._onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.shownOnce = storage.get();
  }

  componentDidUpdate() {
    if (this.isVisible()) {
      storage.set(true);
      this.shownOnce = true;
    }
  }

  onClose() {
    this.setState({ closed: true });
  }

  isVisible() {
    return !this.shownOnce && this.props.visible && !this.state.closed;
  }

  render() {
    if (window.navigator.standalone) return null;

    return (
      <Popup visible={ this.isVisible() } onClose={ this._onClose }>
        <div className={ styles.bubble }>Add this web app to your Home Screen</div>
      </Popup>
    );
  }
}
