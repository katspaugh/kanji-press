import React from 'react';
import classnames from 'classnames';
import styles from './Info.css';

export default class HomeScreenBubble extends React.PureComponent {
  render() {
    const { word, meaning, reading, level } = this.props.item;

    const task = meaning
      .split(';')
      .slice(0, 2)
      .map(part => part.split(',').slice(0, 2).join(','))
      .join(';');

    const hintText = this.props.showAnswer ? word : reading;
    const hint = this.props.showHint ? <div className={ styles.hint }>{ hintText }</div> : '';

    const classes = classnames(styles.info, {
      [styles.infoCorrect]: this.props.isCorrect
    });

    return (
      <div className={ classes }>
        <div className={ styles.task }>{ task }</div>

        { hint }

        <div className={ styles.answer }>
          { word }
          <div className={ styles.reading }>
            { reading }
            <span> – { level }</span>
          </div>
        </div>
      </div>
    );
  };
}
