import React from 'react';
import './styles/game-view.css';

export const NOTE_STATE = Object.freeze({
  WAITING: 0, 
  CORRECT: 1,
  INCORRECT: 2
});

export default class GameView extends React.Component {
  render() {
    const { note, noteState } = this.props;
    let colorClass;
    switch (noteState) {
      case NOTE_STATE.CORRECT:
        colorClass = "has-text-success";
        break;
      case NOTE_STATE.INCORRECT:
        colorClass = "has-text-danger";
        break;
      default:
        colorClass = "has-text-info";
        break;
    }
    return (
      <div>
        <div className={`has-text-centered ${colorClass}`}>
          <span className="big-game-text">{note}</span>
        </div>
      </div>
    )
  }
}
