import React from "react";
import {
  NoteLearner as NoteLearnerLib,
  ConfigPersistence,
  ToneNotePlayer as NotePlayer,
  NoteWithClef,
} from "../lib";
import { GameView, NOTE_STATE } from "./GameView";
import { DeviceSelector } from "./DeviceSelector";
import { Options } from "./Options";

import "./styles/NoteLearner.css";

const GAME_STATE = Object.freeze({
  SETUP: 0,
  WAITING: 1,
  RUNNING: 2,
  NOT_SUPPORTED: 3,
});

function NotSupportedMessage() {
  return <h1>Your browser does not support WebMidi! Try Chrome instead.</h1>;
}

const StartButton: React.FC<{ startGame: () => void }> = ({ startGame }) => {
  return (
    <div className="has-text-centered">
      <button className="button is-primary is-centered" onClick={startGame}>
        Start
      </button>
    </div>
  );
};

const GameHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="columns">
      <div className="column">
        <h1>Note Learner</h1>
      </div>
      <div className="column">{children}</div>
    </div>
  );
};

type Settings = {
  deviceId: string | null;
  octaves: number;
  showNoteName: boolean;
};

type State = {
  gameState: number;
  deviceId: string | null;
  midiEnabled: boolean;
  currentNote: NoteWithClef | null;
  noteState: number;
  showNoteName: boolean;
  octaves: number;
};

type Props = {};

export class NoteLearner extends React.Component<Props, State> {
  player: NotePlayer;
  learner: NoteLearnerLib;
  config: ConfigPersistence;

  constructor(props: Props) {
    super(props);

    this.player = new NotePlayer();
    this.learner = new NoteLearnerLib(this.player);
    this.config = new ConfigPersistence("NOTE_LEARNER");

    this.state = {
      gameState: GAME_STATE.SETUP,
      deviceId: null,
      midiEnabled: false,
      currentNote: null,
      noteState: NOTE_STATE.WAITING,
      showNoteName: true,
      octaves: 1,
    };
    this.learner.setOctaves(this.state.octaves);

    this.updateDevice = this.updateDevice.bind(this);
    this.startGame = this.startGame.bind(this);
    this.noteResultHandler = this.noteResultHandler.bind(this);
    this.nextNote = this.nextNote.bind(this);
    this.handleShowNoteNameChange = this.handleShowNoteNameChange.bind(this);
    this.handleOctaveChange = this.handleOctaveChange.bind(this);
    this.saveSettings = this.saveSettings.bind(this);

    (window as any).learner = this.learner;
  }

  loadSettings() {
    if (!this.config.isSet()) return;

    const config = this.config.load<Settings>();
    this.setState(config, () => {
      this.learner.setOctaves(this.state.octaves);
    });
  }

  saveSettings() {
    const { octaves, showNoteName, deviceId } = this.state;
    const settings: Settings = { octaves, showNoteName, deviceId };
    this.config.save(settings);
  }

  componentDidMount() {
    this.learner.on("noteChecked", this.noteResultHandler);
    this.learner
      .enableMidi()
      .then(() => {
        const devices = this.learner.getDevices();
        const deviceId = devices.length > 0 ? devices[0].id : null;
        this.learner.setDevice(deviceId);
        this.setState(
          {
            gameState: GAME_STATE.WAITING,
            midiEnabled: true,
            deviceId: deviceId,
          },
          this.loadSettings
        );
      })
      .catch((err) => {
        console.error(err);
        this.setState({ gameState: GAME_STATE.NOT_SUPPORTED });
      });
  }

  startGame() {
    this.setState({
      gameState: GAME_STATE.RUNNING,
      currentNote: this.learner.nextNote(),
    });
  }

  updateDevice(deviceId: string) {
    this.learner.setDevice(deviceId);
    this.setState({ deviceId }, this.saveSettings);
  }

  nextNote() {
    this.setState({
      currentNote: this.learner.nextNote(),
      noteState: NOTE_STATE.WAITING,
    });
  }

  noteResultHandler(successful: boolean) {
    if (successful) {
      setTimeout(this.nextNote, 250);
      this.setState({ noteState: NOTE_STATE.CORRECT });
    } else {
      setTimeout(() => {
        this.setState({ noteState: NOTE_STATE.WAITING });
      }, 250);
      this.setState({ noteState: NOTE_STATE.INCORRECT });
    }
  }

  handleShowNoteNameChange(showNoteName: boolean) {
    this.setState(
      {
        showNoteName,
      },
      this.saveSettings
    );
  }

  handleOctaveChange(octaves: number) {
    this.learner.setOctaves(octaves);
    this.setState(
      {
        octaves,
      },
      this.saveSettings
    );
  }

  render() {
    const {
      gameState,
      deviceId,
      currentNote,
      noteState,
      showNoteName,
      octaves,
    } = this.state;

    let body;
    switch (gameState) {
      case GAME_STATE.NOT_SUPPORTED:
        body = <NotSupportedMessage />;
        break;
      case GAME_STATE.WAITING:
        body = <StartButton startGame={this.startGame} />;
        break;
      case GAME_STATE.RUNNING:
        if (!currentNote) throw new Error("Game started without note!");
        body = (
          <GameView
            note={currentNote}
            noteState={noteState}
            showName={showNoteName}
          />
        );
        break;
      case GAME_STATE.SETUP:
        body = <h4>Loading...</h4>;
        break;
      default:
        body = <h4>UNKNOWN STATE. WHAT?!?!</h4>;
    }

    return (
      <div>
        <GameHeader>
          <DeviceSelector
            value={deviceId || ""}
            devices={this.learner.getDevices()}
            handleDeviceChange={this.updateDevice}
          />
        </GameHeader>
        <div className="note-learner-body">{body}</div>
        <Options
          showNoteName={showNoteName}
          onShowNoteNameChanged={this.handleShowNoteNameChange}
          octaves={octaves}
          onOctavesChanged={this.handleOctaveChange}
        />
      </div>
    );
  }
}
