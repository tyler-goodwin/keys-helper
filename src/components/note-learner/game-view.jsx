import React from 'react';
import Staff from './staff';
import './styles/game-view.css';

export const NOTE_STATE = Object.freeze({
  WAITING: 0, 
  CORRECT: 1,
  INCORRECT: 2
});

export default function GameView({ note, noteState }) {
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
      <div className={`has-text-centered ${colorClass} columns is-vcentered is-centered`}>
        <div className="column is-narrow">
          <div className="big-game-text">{note}</div>
        </div>
        <div className="column is-narrow">
          <Staff notes={[`${note}/4`]} className="note-learner-staff" />
        </div>
      </div>
    </div>
  );
}
