import React from 'react';

export default class GameView extends React.Component {
  render() {
    const { note } = this.props;
    return (
      <div>
        <div className="has-text-centered">
          <h1 className="title">{note}</h1>
        </div>
      </div>
    )
  }
}
