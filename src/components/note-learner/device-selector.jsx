import React from 'react';

export default function DeviceSelector({handleDeviceChange, value, devices }) {
    return (
      <div className="field is-horizontal is-pulled-right">
        <div className="field-label is-normal" style={{minWidth: '120px'}}>
          <label className="label">Midi Device</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <div className="select">
                <select value={value} onChange={handleDeviceChange}>
                  {
                    devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                  }
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }