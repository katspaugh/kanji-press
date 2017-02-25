import React from 'react';
import Popup from './popup.jsx';

const soundIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><path d="M126.5625 301.0781 L60.3281 239.9062 L18.5625 239.9062 L18.5625 157.5 L60.4688 157.5 L126.5625 96.4688 L126.5625 301.0781 Z" fill="#000" stroke="none"/></svg>';


export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = { visible: false };

    this._onChange = this.onChange.bind(this);
    this._open = this.toggle.bind(this, true);
    this._close = this.toggle.bind(this, false);
  }

  onChange(e) {
    const value = e.target.value;
    this.props.onLevelSelect(value, !this.props.levels[value]);
  }

  toggle(bool) {
    if (this.state.visible === bool) return;
    if (this.isToggling) return;

    this.isToggling = true;

    setTimeout(() => {
      this.setState({ visible: bool });
      this.isToggling = false;
    }, 10);
  }

  render() {
    const levels = this.props.levels;

    return (
      <div className="kanji-settings">
        <div className="kanji-button kanji-button__settings" onMouseUp={ this._open }>⚙</div>

        <div className={ 'kanji-button kanji-button__mute' + (this.props.isMute ? ' kanji-button__muted' : '') }
             onMouseDown={ this.props.onMute }>♫</div>

        <Popup visible={ this.state.visible } onClose={ this._close }>
          <div className="kanji-settings-popup">
            <div className="kanji-settings-control">
              <label>
                <input type="checkbox" value="jlpt5" checked={ levels.jlpt5 } onChange={ this._onChange } />
                JLPT 5
              </label>
            </div>

            <div className="kanji-settings-control">
              <label>
                <input type="checkbox" value="jlpt4" checked={ levels.jlpt4 } onChange={ this._onChange } />
                JLPT 4
              </label>
            </div>

            <div className="kanji-settings-control">
              <label>
                <input type="checkbox" value="jlpt3" checked={ levels.jlpt3 } onChange={ this._onChange } />
                JLPT 3
              </label>
            </div>

            <div className="kanji-settings-control">
              <label>
                <input type="checkbox" value="jlpt2" checked={ levels.jlpt2 } onChange={ this._onChange } />
                JLPT 2
              </label>
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}
