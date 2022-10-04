import './App.css';
import React from "react";
import ReactDOM from "react-dom";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import ToDoStore from './ToDoStore';
import ToDoObservable from './ToDoObservable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Learn MobX.
        </p>
      </header>
    </div>
  );
}

export default App;
