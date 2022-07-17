export type NoteName =
  | "C"
  | "Cb"
  | "C#"
  | "D"
  | "Db"
  | "D#"
  | "E"
  | "Eb"
  | "E#"
  | "F"
  | "Fb"
  | "F#"
  | "G"
  | "Gb"
  | "G#"
  | "A"
  | "Ab"
  | "A#"
  | "B"
  | "Bb"
  | "B#";

export interface Note {
  name: NoteName;
  octave: number;
}

export type NotePlayer = {
  play: (note: Note) => void;
  start: (note: Note) => void;
  stop: (note: Note) => void;
};
