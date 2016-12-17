import React from 'react';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = { opened: false };

    this.onChange = (e) => this.props.onLevelSelect(e.target.value, e.target.checked);
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ opened: !this.state.opened });
  }

  render() {
    let style = {
      display: this.state.opened ? '' : 'none'
    };

    let levels = this.props.levels;

    return (
      <div className="kanji-settings">
        <div className="kanji-settings-button" onClick={ this.toggle.bind(this) }>⚙</div>

        <div className="kanji-settings-popup" style={ style }>
          <div className="kanji-settings-control">
            <label>
              <input type="checkbox" value="jlpt5" checked={ levels.jlpt5 } onChange={ this.onChange } />
              JLPT 5
            </label>
          </div>

          <div className="kanji-settings-control">
            <label>
              <input type="checkbox" value="jlpt4" checked={ levels.jlpt4 } onChange={ this.onChange } />
              JLPT 4
            </label>
          </div>

          <div className="kanji-settings-control">
            <label>
              <input type="checkbox" value="jlpt3" checked={ levels.jlpt3 } onChange={ this.onChange } />
              JLPT 3
            </label>
          </div>

          <div className="kanji-settings-control">
            <label>
              <input type="checkbox" value="jlpt2" checked={ levels.jlpt2 } onChange={ this.onChange } />
              JLPT 2
            </label>
          </div>
        </div>
      </div>
    );
  }
}
