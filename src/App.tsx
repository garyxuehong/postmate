import React from "react";
import logo from "./logo.svg";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { Button } from "semantic-ui-react";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button primary>Primary</Button>
      </header>
    </div>
  );
};

export default App;
