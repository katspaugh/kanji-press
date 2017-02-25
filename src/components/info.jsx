import React from 'react';

export default function render(props) {
  const answer = props.item.word;
  const reading = props.item.reading;
  const level = props.item.level;

  const task = props.item.meaning
        .split(';')
        .slice(0, 2)
        .map((part) => part.split(',').slice(0, 2).join(','))
        .join(';');

  const hintText = props.showAnswer ? answer : reading;
  const hint = props.showHint ? <div className="kanji-hint">{ hintText }</div> : '';

  return (
    <div className={ 'kanji-info' + (props.isCorrect ? ' kanji-info__correct' : '') }>
      <div className="kanji-task">{ task }</div>

      { hint }

      <div className="kanji-answer">
        { answer }
        <div className="kanji-answer-reading">
          { reading }
          <span> – { level }</span>
        </div>
      </div>
    </div>
  );
};
