import WebMidi from 'webmidi';
import EventEmitter from 'events';

const C_MAJOR_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SCALES = {
  C_MAJ: C_MAJOR_NOTES,
}

function getRandomNote(scale) {
  const i = Math.floor(Math.random() * Math.floor(scale.length));
  return scale[i];
}

function buildNote(note) {
  return `${note.name}${note.octave}`;
}

export default class NoteLearner extends EventEmitter {
  constructor(notePlayer) {
    super();
    this.player = notePlayer;
    this.note = null;
    this.device = null;
    this.reportResultCallback = null;

    this.nextNote = this.nextNote.bind(this);
    this.checkNote = this.checkNote.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.setDevice = this.setDevice.bind(this);
    this.enableMidi = this.enableMidi.bind(this);
  }

  // Returns a note name and plays that note
  nextNote() {
    console.log("Next Note called");
    this.note = getRandomNote(SCALES.C_MAJ);
    this.player.play(this.note);
    return this.note;
  }

  checkNote(note) {
    console.log("Check note called with:", note, "current:", this.note);
    this.emit('noteChecked', this.note === note);
  }

  getAverageResponseTime() {
    // TODO
  }

  getDevices() {
    return WebMidi.inputs.map(i => ({ id: i.id, name: i.name }));
  }

  setDevice(deviceId) {
    if(this.device) {
      this.device.removeListener('noteon');
      this.device.removeListener('noteoff');
    }
    if (!deviceId) {
      this.device = null;
      return;
    }
    this.device = WebMidi.getInputById(deviceId);
    this.device.addListener('noteon', 'all', (event) => {
      this.player.start(buildNote(event.note));
      this.checkNote(event.note.name);
    });
    this.device.addListener('noteoff', 'all', (event) => {
      this.player.stop(buildNote(event.note));
    });
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