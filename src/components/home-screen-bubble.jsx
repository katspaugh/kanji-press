import React from 'react';

import Storage from '../services/storage.js';
import Popup from './popup.jsx';

const storage = new Storage('kanji-press-home-screen-msg');

export default class HomeScreenBubble extends React.Component {
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
    return (
      <Popup visible={ this.isVisible() } onClose={ this._onClose }>
        <div className="kanji-bubble">Add this web app to your Home Screen</div>
      </Popup>
    );
  }
}
