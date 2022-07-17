import React from "react";

export type Device = {
  id: string;
  name: string;
};

type Props = {
  devices: Device[];
  handleDeviceChange: (deviceId: string) => void;
  value: string;
};

export const DeviceSelector: React.FC<Props> = ({
  handleDeviceChange,
  value,
  devices,
}) => {
  return (
    <div className="field is-horizontal is-pulled-right">
      <div className="field-label is-normal" style={{ minWidth: "120px" }}>
        <label className="label">Midi Device</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control">
            <div className="select">
              <select
                value={value}
                onChange={(event) =>
                  handleDeviceChange(event.currentTarget.value)
                }
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
