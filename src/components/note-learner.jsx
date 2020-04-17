import React from 'react';
import NoteLearnerLib from '../lib/note-learner';
import NotePlayer from '../lib/note-player';
import GameView from './note-learner/game-view';
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
    super(props)
    this.player = new NotePlayer();
    this.learner = new NoteLearnerLib(this.player);
    this.state = {
      gameState: GAME_STATE.SETUP,
      deviceId: null,
      midiEnabled: false,
      currentNote: '',
    }
    
    this.updateDevice = this.updateDevice.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleDeviceChange = this.handleDeviceChange.bind(this);
  }

  componentDidMount() {
    this.learner.enableMidi()
      .then(() => {
        const devices = this.learner.getDevices();
        const deviceId = devices > 0 ? [0].id : null;
        this.setState({ 
          gameState: GAME_STATE.WAITING, 
          midiEnabled: true, 
          deviceId: deviceId
        })
      }).catch(err => {
        this.setState({ gameState: GAME_STATE.NOT_SUPPORTED })
      });
  }

  startGame() {
    const note = this.learner.nextNote();
    console.log("Got note:", note);
    this.setState({
      gameState: GAME_STATE.RUNNING,
      currentNote: note,
    });
  }

  updateDevice(deviceId) {
    console.log(`Updating device to ${deviceId}`);
    this.setState({ deviceId }, () => {
      this.learner.setDevice(deviceId);
    });
  }

  handleDeviceChange(event) {
    console.log("Value: ", event.target.value);
    this.updateDevice(event.target.value);
  }

  render() {
    const { gameState, deviceId, currentNote } = this.state;
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