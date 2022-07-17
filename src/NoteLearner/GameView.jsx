import React from "react";
import Staff from "./staff";
import "./styles/game-view.css";

export const NOTE_STATE = Object.freeze({
  WAITING: 0,
  CORRECT: 1,
  INCORRECT: 2,
});

export default function GameView({ note, noteState, showName }) {
  let colorClass;
  switch (noteState) {
    case NOTE_STATE.CORRECT:
      colorClass = "has-text-success border-bottom-success";
      break;
    case NOTE_STATE.INCORRECT:
      colorClass = "has-text-danger border-bottom-danger";
      break;
    default:
      colorClass = "has-text-info border-bottom-info";
      break;
  }
  return (
    <div>
      <div
        className={`has-text-centered ${colorClass} columns is-vcentered is-centered`}
      >
        <div className="column is-narrow">
          {showName && <div className="big-game-text">{note.name}</div>}
        </div>
        <div className="column is-narrow">
          <Staff
            notes={[{ name: note.name, octave: note.octave, clef: note.clef }]}
            className="note-learner-staff"
          />
        </div>
      </div>
    </div>
  );
}
