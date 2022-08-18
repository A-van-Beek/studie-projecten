import React from "react";
import Child from "./Child";
import { Button } from "semantic-ui-react";
import { useState } from "react";
import "../App.css";

/**
 * bij het aanroepen van de component Child:
 * wordt de data als props meegegeven.
 */

export default function Parent() {
  const [data, setData] = useState("");

  const parentToChild = () => {
    // actueel vastleggen van nieuwe gegevens in de state
    setData("data from Parent to the Child.");
  };

  return (
    <div>
      <Child parentToChild={data} />

      <div className="child">
        <Button primary onClick={() => parentToChild()}>
          Click Parent To Child
        </Button>
      </div>
    </div>
  );
}
