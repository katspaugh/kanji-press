import React from 'react';

const backgrounds = [
  'https://67.media.tumblr.com/9c41d47fc9ed73697dc5147294574382/tumblr_nq5o3iN7uJ1rd4ymxo1_500.gif',
  'http://media1.giphy.com/media/MhHXeM4SpKrpC/giphy.gif',
  'https://media.giphy.com/media/MziKDo6gO7x8A/giphy.gif'
];

// Pre-load backgrounds
backgrounds.forEach((url) => (new Image()).src = url);

export default class Info extends React.Component {
  render() {
    let task = (this.props.task || '')
      .split(';')
      .slice(0, 2)
      .map((part) => part.split(',').slice(0, 2).join(','))
      .join(';');

    let style = {};

    if (this.props.finished) {
      let image = backgrounds.shift();
      backgrounds.push(image);
      style.backgroundImage = `url(${ image })`;
      style.opacity = 1;
    }

    return (
      <div className="kanji-top">
        <div className={ 'kanji-info' + (this.props.correct ? ' kanji-info__correct' : '') }>
          <div className="kanji-task">{ task }</div>

          <div className="kanji-hint">{ this.props.hint }</div>
        </div>

        <div className="kanji-cover" style={ style }></div>
      </div>
    );
  }
}
