import React from "react";
import NoteLearner from "./components/note-learner";
import "./App.scss";

function App() {
  return (
    <div className="container content">
      <header className="App-header">
        <div className="container">
          <h1 className="title">Music Utils</h1>
        </div>
      </header>
      <div className="container">
        <NoteLearner />
      </div>
    </div>
  );
}

export default App;
