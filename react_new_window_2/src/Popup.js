import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { createPortal } from "react-dom";

const Popup = ({ toggleWindow, showWindow }) => {
  const externalWindow = useRef(
    window.open("", "", "width=600,height=400,left=200,top=200")
  );

  useEffect(() => {
    const currentWindow = externalWindow.current;
    return () => currentWindow.close();
  }, []);

  const content = <p>Tekst in een apart scherm !!</p>;
  const containerEl = document.createElement("div");

  externalWindow.current.document.title = "Mijn window";
  externalWindow.current.document.body.appendChild(containerEl);
  externalWindow.current.addEventListener("beforeunload", (e) => {
    toggleWindow(e);
  });


  const popupWindow = createPortal(content, containerEl);

  return (
    <div style={{ border: "2px solid black" }}>
      <p>popup: this child is placed in the parent div</p>
      <button onClick={toggleWindow}>open of sluiten externe scherm</button>
      {showWindow ? popupWindow : null}
    </div>
  );
};

export default Popup;
