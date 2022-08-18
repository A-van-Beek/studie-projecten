import React from "react";
import ParentToChild from "./ParentToChild/ParentToChild";
import ChildToParent from "./ChildToParent/ChildToParent";
import "./App.css";

// hier is de state nog niet op hoogste niveau !!

export default function App() {
  return (
    <div className="App">
      {/* Parent To Child */}
      <ParentToChild />

      {/* Child to Parent */}
      <ChildToParent />
    </div>
  );
}
