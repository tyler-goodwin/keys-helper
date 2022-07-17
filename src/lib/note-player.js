import * as Tone from "tone";

const DURATIONS = {
  quarter: "4n",
  eighth: "8n",
};

export default class ToneNotePlayer {
  constructor() {
    this.synth = new Tone.PolySynth({ maxPolyphony: 10 }).toDestination();
  }

  // Note: {name: "C", octave: 4}
  play(note) {
    this.synth.triggerAttackRelease(
      `${note.name}${note.octave}`,
      DURATIONS.eighth
    );
  }

  start(note) {
    this.synth.triggerAttack(note);
  }

  stop(note) {
    this.synth.triggerRelease(note);
  }
}
