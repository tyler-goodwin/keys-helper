import { WebMidi, Input, NoteMessageEvent } from "webmidi";
import { EventEmitter } from "events";
import type { Note, NoteName, NotePlayer } from "./types";

type OctaveRange = { min: number; max: number };
type NoteWithClef = Note & { clef: "treble" | "bass" };

const OCTAVES: Record<number, OctaveRange> = Object.freeze({
  1: { min: 4, max: 4 },
  2: { min: 3, max: 4 },
  3: { min: 3, max: 5 },
  4: { min: 2, max: 5 },
});

const C_MAJOR_NOTES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const SCALES = {
  C_MAJ: C_MAJOR_NOTES,
};

function getRandom(minimum: number, maximum: number) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNote(scale: NoteName[]) {
  const i = getRandom(0, scale.length - 1);
  return scale[i];
}

function getRandomOctave(numOctaves: number) {
  const o = OCTAVES[numOctaves];
  return getRandom(o.min, o.max);
}

function buildNote(note: Note) {
  return `${note.name}${note.octave}`;
}

const eventToNote = (event: NoteMessageEvent) => {
  return {
    name: event.note.name as NoteName,
    octave: event.note.octave,
  };
};

// Returns the clef of the note or a random clef if note is C4
// Notes higher than C4 will always be treble, lower than will always be bass
function getClef({ name, octave }: Note) {
  if (name === "C" && octave === 4) {
    return getRandom(0, 1) === 1 ? "treble" : "bass";
  }
  return octave < 4 ? "bass" : "treble";
}

export default class NoteLearner extends EventEmitter {
  note: null | NoteWithClef;
  numOctaves: number;
  device: null | Input;
  player: NotePlayer;
  reportResultCallback: (() => void) | null;

  constructor(notePlayer: NotePlayer) {
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
  }

  // Returns a note name and plays that note
  nextNote = (): NoteWithClef => {
    const name = getRandomNote(SCALES.C_MAJ);
    const octave = getRandomOctave(this.numOctaves);
    const clef = this.numOctaves === 1 ? "treble" : getClef({ name, octave });
    this.note = { name, octave, clef };
    if (!this.note) throw new Error("Note is null!");
    this.player.play(this.note);
    return this.note!;
  };

  checkNote = (note: Note) => {
    const { name, octave } = this.note || {};
    this.emit("noteChecked", name === note.name && octave === note.octave);
  };

  // Can be 1-4
  setOctaves = (num: number) => {
    if (num < 1 || num > 4) {
      throw new Error("Num Octaves cannot be outside of range 1-4");
    }
    this.numOctaves = num;
  };

  setDevice = (deviceId: string) => {
    if (this.device) {
      this.device.removeListener("noteon");
      this.device.removeListener("noteoff");
    }
    if (!deviceId) {
      this.device = null;
      return;
    }

    this.device = WebMidi.getInputById(deviceId);
    this.device.addListener("noteon", (event) => {
      const note = eventToNote(event);
      this.player.start(note);
      this.checkNote(note);
    });
    this.device.addListener("noteoff", (event) => {
      const note = eventToNote(event);
      this.player.stop(note);
    });
  };

  getDevices = () => {
    return WebMidi.inputs.map((i) => ({ id: i.id, name: i.name }));
  };

  enableMidi = async () => {
    await WebMidi.enable();
    if (WebMidi.inputs.length > 0) {
      this.setDevice(WebMidi.inputs[0].id);
    }
  };
}
