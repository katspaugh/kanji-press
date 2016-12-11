import React from 'react';

export default class Info extends React.Component {
  render() {
    let task = (this.props.task || '')
      .split(';')
      .slice(0, 2)
      .map((part) => part.split(',').slice(0, 2).join(','))
      .join(';');

    return (
      <div className={ 'kanji-info' + (this.props.correct ? ' kanji-info__correct' : '') }>
        <div className="kanji-task">{ task }</div>

        <div className="kanji-hint">{ this.props.hint }</div>
      </div>
    );
  }
}
