import * as Tone from 'tone';

// TODO: Add sharps/flats
const NOTES = {
  A: 'A4',
  B: 'B4',
  C: 'C4',
  D: 'D4',
  E: 'E4',
  F: 'F4',
  G: 'G4',
};

const DURATIONS = {
  quarter: "4n",
  eighth: "8n"
};

export default class ToneNotePlayer {
  constructor() {
    this.synth = new Tone.PolySynth(10).toMaster();
  }

  play(note) {
    if (!NOTES[note]) {
      throw new Error(`Invalid note '${note}' provided`);
    }
    this.synth.triggerAttackRelease(NOTES[note], DURATIONS.eighth);
  }

  start(note) {
    this.synth.triggerAttack(note);
  }

  stop(note) {
    this.synth.triggerRelease(note);
  }
}