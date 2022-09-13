import React from "react";


const TabLists = ({ contentItems, addSelectedTopic }) => {
  const listItems = contentItems.map((item) => (
    <li key={item.idItem}>
      <input id="check_" type="checkbox" onChange={(e) => {
        e.stopPropagation();
        addSelectedTopic(e, item.idItem)
      }}/>
      <label> {item.annotatieTitle}</label>
    </li>
  ));

  return <ul className="listLayOut">{listItems}</ul>;
};

export default TabLists;
