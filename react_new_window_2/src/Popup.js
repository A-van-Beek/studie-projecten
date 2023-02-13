import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { createPortal } from "react-dom";

const Popup = () => {
  const externalWindow = useRef(
    window.open("", "", "width=600,height=400,left=200,top=200")
  );

//   const [isOpenPopup, setIsOpenPopup] = useState(false);
  const content = (
    <p>popup, portal-content: this child is placed in de document body</p>
  );
  const containerEl = document.createElement("div");

  externalWindow.current.document.title = "Mijn window";
  externalWindow.current.document.body.appendChild(containerEl);

  return (
    <div style={{ border: "2px solid black" }}>
      <p>popup: this child is placed in the parent div</p>
      <button>
        {!externalWindow ? "Close" : "Open"}
      </button>
      {createPortal(content, containerEl)}
    </div>
  );
};

export default Popup;
