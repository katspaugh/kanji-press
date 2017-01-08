import React from 'react';
import ReactDOM from 'react-dom';

export default class Popup extends React.Component {
  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);

    this._onOutsideClick = (e) => {
      if (this.props.visible && !domNode.contains(e.target)) {
        this.props.onClose();
      }
    };

    document.addEventListener('mousedown', this._onOutsideClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._onOutsideClick, true);
  }

  render() {
    return (
      <div className={ 'kanji-popup' + (this.props.visible ? ' kanji-popup__visible' : '') }>
        { this.props.children }
      </div>
    );
  }
}
