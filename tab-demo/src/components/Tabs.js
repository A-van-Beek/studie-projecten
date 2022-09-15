import React, { useEffect, useState } from "react";
import { dataTabs } from "./dataTabs";
import TabLists from "./TabLists";
import {Counter} from "./Counters";

const Tabs = () => {
  const [currentTab, setCurrentTab] = useState("tab-1");
  const [filterLists, setFilterLists] = useState(undefined);
  const [activeFilters, setActiveFilters] = useState([]);
  // [{tabName: "tab-1", filterList: [1,2]}]

  useEffect(() => {
    setFilterLists(dataTabs);
  }, []);

  useEffect(() => {
    console.log("state activeFilters is changed:", activeFilters);
  });
  

  const handleSubmitFilter = () => {
    console.log("zoekt....")
    // console.log("zoeken op:", activeFilters)
  };

  const handleTabClick = (e) => {
    setCurrentTab(e.target.id);
  };

  function selectingTopic(tabId, id, item) {
    setChecked(tabId, id); //de toggle van de checkbox
    setFilters(item);
  }

  const setFilters = (item) => {
    if (item.checked) {
      setActiveFilters([...activeFilters, item]);
    } else {
      let tmpFilters = activeFilters.filter((i) => i.idItem !== item.idItem);
      setActiveFilters(tmpFilters);
    }
  };

  function setChecked(tabId, id) {
    //zoek index-nummer van het tabblad
    let filterIndex = filterLists.findIndex((x) => x.id === tabId);
    //zoek index-nummer van het item/onderwerp
    let itemIndex = filterLists[filterIndex].contentItems.findIndex(
      (i) => i.idItem === id
    );
    let itemChecked = filterLists[filterIndex].contentItems[itemIndex];
    //toggle checkbox
    let tmpArray = [
      ...filterLists,
      (itemChecked.checked = !itemChecked.checked),
    ];
    setFilterLists(tmpArray);
  }

  return (
    <div className="container">
      <div className="tabs">
        {dataTabs.map((tab, i) => (
          <button
            key={i}
            id={tab.id}
            disabled={currentTab === `${tab.id}`}
            onClick={handleTabClick}
          >
            {tab.tabTitle}
          </button>
        ))}
      </div>
      <div className="content">
        {dataTabs.map((tab, i) => (
          <div key={i}>
            {currentTab === `${tab.id}` && (
              <div>
                <p className="title">{tab.title}</p>
                <p>{tab.content}</p>
                <TabLists
                  contentItems={tab.contentItems}
                  selectingTopic={selectingTopic}
                  tabId={tab.id}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div>U hebt <Counter activeFilters={activeFilters}/> filter(s) gezet.</div>
      <button onClick={() => handleSubmitFilter()}>zoek met filter</button>
    </div>
  );
};

export default Tabs;
