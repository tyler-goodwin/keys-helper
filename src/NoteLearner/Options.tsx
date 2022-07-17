import React from "react";
import "./styles/options.css";

type Props = {
  showNoteName: boolean;
  onShowNoteNameChanged: (checked: boolean) => void;
  octaves: number;
  onOctavesChanged: (octaves: number) => void;
};

export const Options: React.FC<Props> = ({
  showNoteName,
  onShowNoteNameChanged,
  octaves,
  onOctavesChanged,
}) => {
  return (
    <div className="options-box">
      <h3>Options</h3>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Octaves</label>
        </div>
        <div className="field-body">
          <div className="control">
            <div className="select is-primary">
              <select
                value={octaves}
                onChange={(e) =>
                  onOctavesChanged(parseInt(e.currentTarget.value))
                }
              >
                <option value={1}>1 Octave</option>
                <option value={2}>2 Octaves</option>
                <option value={3}>3 Octaves</option>
                <option value={4}>4 Octaves</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal is-grouped is-grouped-multiline">
        <div className="field-label is-normal"></div>
        <div className="field-body">
          <div className="control">
            <label className="checkbox">
              <input
                name="ShowNoteName"
                type="checkbox"
                className="show-note-names-checkbox"
                checked={showNoteName}
                onChange={(e) => onShowNoteNameChanged(e.currentTarget.checked)}
              />
              Show Note Names
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
