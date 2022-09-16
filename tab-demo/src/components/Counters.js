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

export const TabCounter = (props) => {
    let tabId = props.tabId;
    let activeFilters = props.activeFilters;
    let filterLists = props.filterLists;
    // console.log("filterLists", filterLists)
  return <span> ({tabId})</span>;
};
