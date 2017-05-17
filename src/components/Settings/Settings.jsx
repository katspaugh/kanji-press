import React from 'react';
import classnames from 'classnames';
import Popup from '../Popup/Popup.jsx';
import styles from './Settings.css';


export default class Settings extends React.PureComponent {
  constructor() {
    super();

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
    const { levels, isMute, onMute } = this.props;

    const openButtonClasses = classnames(styles.button, styles.buttonSettings);

    const muteButtonClasses = classnames(styles.button, styles.buttonMute, {
      [styles.buttonMuted]: isMute
    });

    return (
      <div className={ styles.settings }>
        <div className={ openButtonClasses } onMouseUp={ this._open }>⚙</div>

        <div className={ muteButtonClasses } onMouseDown={ onMute }>♫</div>

        <Popup visible={ this.state.visible } onClose={ this._close }>
          <div className={ styles.popup }>
            <div className={ styles.control }>
              <label>
                <input type="checkbox" value="jlpt5" checked={ levels.jlpt5 } onChange={ this._onChange } />
                JLPT 5
              </label>
            </div>

            <div className={ styles.control }>
              <label>
                <input type="checkbox" value="jlpt4" checked={ levels.jlpt4 } onChange={ this._onChange } />
                JLPT 4
              </label>
            </div>

            <div className={ styles.control }>
              <label>
                <input type="checkbox" value="jlpt3" checked={ levels.jlpt3 } onChange={ this._onChange } />
                JLPT 3
              </label>
            </div>

            <div className={ styles.control }>
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
