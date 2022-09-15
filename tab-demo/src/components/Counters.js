import React from "react";

export const Counter = (props) => {
  const activeFilters = props.activeFilters;
  let counter = activeFilters.length;

  if (counter === 0) {
    return <div>U hebt nog geen filter aangezet.</div>;
  } else if (counter === 1) {
    return <div>U hebt één filter aangezet.</div>;
  } else {
    return <div>U hebt {counter} filters aangezet.</div>;
  }
};

export const TabCounter = () => {
  console.log("TabCounter");
  return;
};
