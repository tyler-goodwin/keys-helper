import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';

const {
  Formatter,
  Stave,
  StaveNote,
  Renderer
} = Vex.Flow;

//Notes should be in format {name: "C", octave: 4, clef: "treble"};
function genVexNotes(notes) {
  const genNotes = (clef) => {
    const n = notes.filter(n => n.clef === clef).map(n => `${n.name}/${n.octave}`);
    return n.length > 0 ? [new StaveNote({
      keys: n,
      duration: 'q',
      clef: clef,
    })] : [];
  }
  return {
    bass: genNotes("bass"),
    treble: genNotes("treble"),
  };
}

export default function Staff({ notes, className = "" }) {
  const outer = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if(rendererRef.current == null){
      rendererRef.current = new Renderer(outer.current, Renderer.Backends.SVG);
    }
    const renderer = rendererRef.current;
    renderer.resize(140, 220);
    const vexNotes = genVexNotes(notes);
    const ctx = renderer.getContext();
    ctx.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    ctx.clear();
    
    const trebleStaff = new Stave(0, 0, 100);
    trebleStaff.addClef("treble")
      .setContext(ctx)
      .draw();
    if(vexNotes.treble.length > 0) {
      Formatter.FormatAndDraw(ctx, trebleStaff, vexNotes.treble);
    }

    const bassStaff = new Stave(0, 75, 100);
    bassStaff.addClef("bass")
      .setContext(ctx)
      .draw();
    if(vexNotes.bass.length > 0) {
      Formatter.FormatAndDraw(ctx, bassStaff, vexNotes.bass);
    }
  }, [notes]);

  return <div ref={outer} className={className} />
}