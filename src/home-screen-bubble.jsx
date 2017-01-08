import React from 'react';
import Popup from './popup.jsx';

const storageKey = 'kanji-press-home-screen-msg';

export default class HomeScreenBubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = { closed: false };
    this._onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.shownOnce = localStorage.getItem(storageKey);
  }

  componentDidUpdate() {
    if (this.isVisible()) {
      localStorage.setItem(storageKey, true);
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
