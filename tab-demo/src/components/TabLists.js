import React from "react";


const TabLists = ({ contentItems, selectingTopic, tabId }) => {
  const listItems = contentItems.map((item) => (
    <li key={item.idItem}>
      <input id="check_" type="checkbox" checked={item.checked} onChange={(e) => {
        e.stopPropagation();
        selectingTopic(tabId, item.idItem, item)
      }}/>
      <label> {item.annotatieTitle}</label>
    </li>
  ));

  return <ul className="listLayOut">{listItems}</ul>;
};

export default TabLists;
