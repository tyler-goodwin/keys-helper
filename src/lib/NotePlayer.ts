import * as Tone from "tone";
import type { Note } from "./types";

const DURATIONS = {
  quarter: "4n",
  eighth: "8n",
};

export default class ToneNotePlayer {
  synth: Tone.PolySynth;

  constructor() {
    this.synth = new Tone.PolySynth({ maxPolyphony: 10 }).toDestination();
  }

  play(note: Note) {
    this.synth.triggerAttackRelease(this.toCombined(note), DURATIONS.eighth);
  }

  start(note: Note) {
    this.synth.triggerAttack(this.toCombined(note));
  }

  stop(note: Note) {
    this.synth.triggerRelease(this.toCombined(note));
  }

  private toCombined = ({ name, octave }: Note) => `${name}${octave}`;
}
