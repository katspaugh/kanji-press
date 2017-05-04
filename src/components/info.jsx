import React from 'react';
import classnames from 'classnames';
import styles from '../css/info.css';

export default class HomeScreenBubble extends React.PureComponent {
  render() {
    const props = this.props;
    const answer = props.item.word;
    const reading = props.item.reading;
    const level = props.item.level;

    const task = props.item.meaning
      .split(';')
      .slice(0, 2)
      .map(part => part.split(',').slice(0, 2).join(','))
      .join(';');

    const hintText = props.showAnswer ? answer : reading;
    const hint = props.showHint ? <div className={ styles.hint }>{ hintText }</div> : '';
    const classes = classnames(styles.info, {
      [styles.infoCorrect]: props.isCorrect
    });

    return (
      <div className={ classes }>
        <div className={ styles.task }>{ task }</div>

        { hint }

        <div className={ styles.answer }>
          { answer }
          <div className={ styles.reading }>
            { reading }
            <span> – { level }</span>
          </div>
        </div>
      </div>
    );
  };
}
