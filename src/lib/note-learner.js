import WebMidi from 'webmidi';
import EventEmitter from 'events';

const OCTAVES = {
  1: { min: 4, max: 4 },
  2: { min: 3, max: 4 },
  3: { min: 3, max: 5 },
  4: { min: 2, max: 5 },
};

const C_MAJOR_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SCALES = {
  C_MAJ: C_MAJOR_NOTES,
};

function getRandom(minimum, maximum) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNote(scale) {
  const i = getRandom(0, scale.length - 1);
  return scale[i];
}

function getRandomOctave(numOctaves) {
  const o = OCTAVES[numOctaves];
  return getRandom(o.min, o.max);
}

function buildNote(note) {
  return `${note.name}${note.octave}`;
}

function getDevices() {
  return WebMidi.inputs.map((i) => ({ id: i.id, name: i.name }));
}

// Returns the clef of the note or a random clef if note is C4
// Notes higher than C4 will always be treble, lower than will always be bass
function getClef(name, octave) {
  if (name === 'C' && octave === 4) {
    return getRandom(0, 1) === 1 ? 'treble' : 'bass';
  }
  return octave < 4 ? 'bass' : 'treble';
}

export default class NoteLearner extends EventEmitter {
  constructor(notePlayer) {
    super();
    this.player = notePlayer;
    this.note = null;
    this.numOctaves = 4;
    this.device = null;
    this.reportResultCallback = null;

    this.nextNote = this.nextNote.bind(this);
    this.checkNote = this.checkNote.bind(this);
    this.setDevice = this.setDevice.bind(this);
    this.enableMidi = this.enableMidi.bind(this);
    this.getDevices = getDevices;
  }

  // Returns a note name and plays that note
  nextNote() {
    const name = getRandomNote(SCALES.C_MAJ);
    const octave = getRandomOctave(this.numOctaves);
    const clef = this.numOctaves === 1 ? 'treble' : getClef(name, octave);
    this.note = { name, octave, clef };
    this.player.play(this.note);
    return this.note;
  }

  checkNote(note) {
    this.emit('noteChecked', this.note.name === note.name && this.note.octave === note.octave);
  }

  // Can be 1-4
  setOctaves(num) {
    if (num < 1 || num > 4) {
      throw new Error('Num Octaves cannot be outside of range 1-4');
    }
    this.numOctaves = num;
  }

  // getAverageResponseTime() {
  //   // TODO
  // }

  setDevice(deviceId) {
    if (this.device) {
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
      this.checkNote(event.note);
    });
    this.device.addListener('noteoff', 'all', (event) => {
      this.player.stop(buildNote(event.note));
    });
  }

  enableMidi() {
    return new Promise((resolve, reject) => {
      WebMidi.enable((err) => {
        if (err) {
          return reject(err);
        }
        if (WebMidi.inputs > 0) {
          this.setDevice(WebMidi.inputs[0]);
        }
        return resolve();
      });
    });
  }
}
