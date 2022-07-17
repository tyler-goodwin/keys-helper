import React, { useRef, useEffect } from "react";
import { render } from "react-dom";
import Vex from "vexflow";
import type { NoteWithClef } from "../lib/NoteLearner";

const { Formatter, Stave, StaveNote, Renderer } = Vex.Flow;

function genVexNotes(notes: NoteWithClef[]) {
  const genNotes = (clef: "treble" | "bass") => {
    const n = notes
      .filter((n) => n.clef === clef)
      .map((n) => `${n.name}/${n.octave}`);
    return n.length > 0
      ? [
          new StaveNote({
            keys: n,
            duration: "q",
            clef: clef,
          }),
        ]
      : [];
  };
  return {
    bass: genNotes("bass"),
    treble: genNotes("treble"),
  };
}

type Props = {
  notes: NoteWithClef[];
  className?: string;
};

export const Staff: React.FC<Props> = ({ notes, className = "" }) => {
  const outer = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Vex.Renderer>(null);

  useEffect(() => {
    if (rendererRef.current == null && outer.current) {
      //@ts-expect-error
      rendererRef.current = new Renderer(outer.current, Renderer.Backends.SVG);
    }
    const renderer = rendererRef.current;
    if (!renderer) throw new Error("No renderer has been setup");

    renderer.resize(140, 220);
    const vexNotes = genVexNotes(notes);
    const ctx = renderer.getContext();
    ctx.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    ctx.clear();

    const trebleStaff = new Stave(0, 0, 100);
    trebleStaff.addClef("treble").setContext(ctx).draw();
    if (vexNotes.treble.length > 0) {
      Formatter.FormatAndDraw(ctx, trebleStaff, vexNotes.treble);
    }

    const bassStaff = new Stave(0, 75, 100);
    bassStaff.addClef("bass").setContext(ctx).draw();
    if (vexNotes.bass.length > 0) {
      Formatter.FormatAndDraw(ctx, bassStaff, vexNotes.bass);
    }
  }, [notes]);

  return <div ref={outer} className={className} />;
};
