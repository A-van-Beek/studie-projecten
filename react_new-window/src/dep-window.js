import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { copyStyles } from "./copy-styles";

export const DepWindow = ({ children, closeWindowPortal }) => {
  const externalWindow = useRef(
    window.open("", "", "width=600,height=400,left=200,top=200")
  );

  const containerEl = document.createElement("div");

  useEffect(() => {
    const currentWindow = externalWindow.current;
    return () => currentWindow.close();
  }, []);

  externalWindow.current.document.title = "Mijn window";
  externalWindow.current.document.body.appendChild(containerEl);
  copyStyles(document, externalWindow.current.document);

  externalWindow.current.addEventListener("beforeunload", () => {
    closeWindowPortal();
  });

  console.log("children", children)

  return ReactDOM.createPortal(children, containerEl);
};