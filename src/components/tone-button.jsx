import React from 'react';
import * as Tone from 'tone';

export default function ToneButton() {
  const playTone = () => {
    const synth = new Tone.Synth().toMaster();
    synth.triggerAttackRelease("C4", "8n");
  }
  return (
    <button onClick={playTone}>
      PLAY ME
    </button>
  );
}