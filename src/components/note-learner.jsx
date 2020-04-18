import React from 'react';
import NoteLearnerLib from '../lib/note-learner';
import NotePlayer from '../lib/note-player';
import GameView, { NOTE_STATE } from './note-learner/game-view';
import DeviceSelector from './note-learner/device-selector';

const GAME_STATE = Object.freeze({
  SETUP: 0,
  WAITING: 1,
  RUNNING: 2,
  NOT_SUPPORTED: 3,
});


function NotSupportedMessage() {
  return (
    <h1>Your browser does not support WebMidi! Try Chrome instead.</h1>
  )
}

function StartButton({startGame}) {
  return (
    <div className="has-text-centered">
      <button 
        className="button is-primary is-centered" 
        onClick={startGame}
      >
        Start
      </button>
    </div>
  )
}

function GameHeader({children}) {
  return (
    <div className="columns">
        <div className="column">
          <h1>Note Learner</h1>
        </div>
        <div className="column">
          {children}
        </div>
      </div>
  )
}

export default class NoteLearner extends React.Component {
  constructor(props) {
    super(props);

    this.player = new NotePlayer();
    this.learner = new NoteLearnerLib(this.player);
    
    this.state = {
      gameState: GAME_STATE.SETUP,
      deviceId: null,
      midiEnabled: false,
      currentNote: '',
      noteState: NOTE_STATE.WAITING,
    }
    
    this.updateDevice = this.updateDevice.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.noteResultHandler = this.noteResultHandler.bind(this);
    this.nextNote = this.nextNote.bind(this);
    
    window.learner = this.learner
  }
  
  componentDidMount() {
    this.learner.on('noteChecked', this.noteResultHandler);
    this.learner.enableMidi()
    .then(() => {
      const devices = this.learner.getDevices();
      const deviceId = devices.length > 0 ? devices[0].id : null;
      this.learner.setDevice(deviceId);
      this.setState({ 
        gameState: GAME_STATE.WAITING, 
        midiEnabled: true, 
        deviceId: deviceId
      })
    }).catch(err => {
      console.error(err);
      this.setState({ gameState: GAME_STATE.NOT_SUPPORTED })
    });
  }
  
  startGame() {
    this.setState({
      gameState: GAME_STATE.RUNNING,
      currentNote: this.learner.nextNote(),
    });
  }

  updateDevice(deviceId) {
    this.learner.setDevice(deviceId);
    this.setState({ deviceId });
  }

  nextNote() {
    this.setState({ 
      currentNote: this.learner.nextNote(),
      noteState: NOTE_STATE.WAITING,
    });
  }

  noteResultHandler(successful) {
    if(successful) {
      setTimeout(this.nextNote, 250);
      this.setState({ noteState: NOTE_STATE.CORRECT });
    } else {
      setTimeout(() => {
        this.setState({ noteState: NOTE_STATE.WAITING });
      }, 250);
      this.setState({ noteState: NOTE_STATE.INCORRECT });
    }
  }

  handleDeviceChange(event) {
    console.log("Value: ", event.target.value);
    this.updateDevice(event.target.value);
  }

  render() {
    const { gameState, deviceId, currentNote, noteState } = this.state;
    let body;
    switch (gameState) {
      case GAME_STATE.NOT_SUPPORTED:
        body = <NotSupportedMessage />
        break;
      case GAME_STATE.WAITING:
        body = <StartButton startGame={this.startGame} />
        break;
      case GAME_STATE.RUNNING:
        body = <GameView
          note={currentNote}
          noteState={noteState}
        />
        break;
      case GAME_STATE.SETUP:
        body = <h4>Loading...</h4>
        break;
      default:
        body = <h4>UNKNOWN STATE. WHAT?!?!</h4>
    }

    return (
      <div>
        <GameHeader>
          <DeviceSelector 
            value={deviceId || ""}
            devices={this.learner.getDevices()}
            handleDeviceChange={this.handleDeviceChange}
          />
        </GameHeader>
        {body}
      </div>
    );
  }

}