import React from "react";
import { NoteLearner } from "./NoteLearner";
import "./App.scss";

export const App: React.FC = () => {
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
};

export default App;
