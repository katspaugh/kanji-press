import React from 'react';
import ReactDOM from 'react-dom';


export default class Popup extends React.PureComponent {
  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);

    this._onOutsideClick = (e) => {
      if (this.props.visible && !domNode.contains(e.target)) {
        this.props.onClose();
      }
    };

    document.addEventListener('touchstart', this._onOutsideClick);
    document.addEventListener('mousedown', this._onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this._onOutsideClick);
    document.removeEventListener('mousedown', this._onOutsideClick);
  }

  render() {
    const style = {
      display: this.props.visible ? 'block' : 'none'
    };

    return (
      <div style={ style }>
        { this.props.children }
      </div>
    );
  }
}
