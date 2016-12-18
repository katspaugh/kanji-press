import React from 'react';

const storageKey = 'kanji-press-home-screen-msg';

export default class HomeScreenBubble extends React.Component {
  constructor(props) {
    super(props);

    this.shownOnce = localStorage.getItem(storageKey);
    this.state = { closed: false };

    this._onOutsideClick = () => {
      if (this.isVisible()) {
        this.setState({ closed: true });
      }
    };
  }

  componentDidMount() {
    document.addEventListener('click', this._onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onOutsideClick);
  }

  componentDidUpdate() {
    if (this.props.visible && !this.shownOnce) {
      localStorage.setItem(storageKey, true);
      this.shownOnce = true;
    }
  }

  isVisible() {
    return !this.shownOnce && this.props.visible && !this.state.closed;
  }

  render() {
    return (
      <div className={ 'kanji-bubble' + (this.isVisible() ? ' kanji-bubble__visible' : '') }>
        Add this web app to your Home Screen
      </div>
    );
  }
}
