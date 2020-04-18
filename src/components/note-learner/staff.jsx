import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';

const {
  Formatter,
  Stave,
  StaveNote,
  Renderer
} = Vex.Flow;

export default function Staff({ notes, className = "" }) {
  const outer = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if(rendererRef.current == null){
      rendererRef.current = new Renderer(outer.current, Renderer.Backends.SVG);
    }
    const renderer = rendererRef.current;
    renderer.resize(140, 120);
    const vexNotes = [new StaveNote({
      keys: notes,
      duration: 'q'
    })];
    const ctx = renderer.getContext();
    ctx.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    ctx.clear();
    const staff = new Stave(0, 0, 100);
    staff.addClef("treble").setContext(ctx).draw();
    Formatter.FormatAndDraw(ctx, staff, vexNotes);
  }, [notes]);

  return <div ref={outer} className={className} />
}