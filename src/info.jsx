import React from 'react';

const backgrounds = [
  '/src/images/cover-1.gif',
  '/src/images/cover-2.gif',
  '/src/images/cover-3.gif'
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default class Info extends React.Component {
  render() {
    let task = (this.props.task || '')
      .split(';')
      .slice(0, 2)
      .map((part) => part.split(',').slice(0, 2).join(','))
      .join(';');

    let style = {};

    if (this.props.finished) {
      let image = getRandom(backgrounds);
      style.backgroundImage = `url(${ image })`;
      style.opacity = 1;
    }

    let hint = this.props.showHint ? <div className="kanji-hint">{ this.props.hint }</div> : '';

    return (
      <div className="kanji-top">
        <div className={ 'kanji-info' + (this.props.correct ? ' kanji-info__correct' : '') }>
          <div className="kanji-task">{ task }</div>
          { hint }
          <div className="kanji-answer">
            { this.props.answer }
            <div className="kanji-answer-reading">{ this.props.hint }</div>
          </div>
        </div>

        <div className="kanji-cover" style={ style }></div>
      </div>
    );
  }
}
