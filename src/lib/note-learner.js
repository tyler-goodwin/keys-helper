import WebMidi from 'webmidi';

const C_MAJOR_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SCALES = {
  C_MAJ: C_MAJOR_NOTES,
}

function getRandomNote(scale) {
  const i = Math.floor(Math.random() * Math.floor(scale.length));
  return scale[i];
}

export default class NoteLearner {
  constructor(notePlayer) {
    this.player = notePlayer;
    this.note = null;
    this.device = null;
  }

  // Returns a note name and plays that note
  nextNote() {
    console.log("Next Note called");
    this.note = getRandomNote(SCALES.C_MAJ);
    this.player.play(this.note);
    return this.note;
  }

  // Checks correct note was played
  checkNote() {
    //TODO
  }

  getAverageResponseTime() {
    // TODO
  }

  getDevices() {
    return WebMidi.inputs.map(i => ({ id: i.id, name: i.name }));
  }

  setDevice(device) {
    this.device = device;
  }

  enableMidi() {
    return new Promise((resolve, reject) => {
      WebMidi.enable(err => {
        if (err) {
          return reject(err);
        }
        if(WebMidi.inputs > 0) {
          this.setDevice(WebMidi.inputs[0]);
        }
        resolve();
      })
    })
  }
}