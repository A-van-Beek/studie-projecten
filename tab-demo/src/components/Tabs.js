import React, { useEffect, useState } from "react";
import { dataTabs } from "./dataTabs";
import TabLists from "./TabLists";
import {Counter} from "./Counters";

const Tabs = () => {
  const [currentTab, setCurrentTab] = useState("tab-1");
  const [filterLists, setFilterLists] = useState(undefined);
  const [activeFilters, setActiveFilters] = useState([]);
  // [{tabName: "tab-1", filterList: [1,2]}]
  const [tabCounter, setTabCounter] = useState([])

  useEffect(() => {
    setFilterLists(dataTabs);
    let obj = {};
    dataTabs.map((tab) => {
      return (obj[tab.id] = 0);
    });
    setTabCounter(obj);
  }, []);

  useEffect(() => {
    // console.log("state activeFilters is changed:", activeFilters);
  });

  console.log("state van counter", tabCounter)

  const handleSubmitFilter = () => {
    console.log("zoekt....")
    // console.log("zoeken op:", activeFilters)
  };

  const handleTabClick = (e) => {
    setCurrentTab(e.target.id);
  };

  function selectingTopic(tabId, id, item) {
    setChecked(tabId, id); //de toggle van de checkbox
    setFilters(item, tabId);
    if (item.checked) { //ophogen / verlagen van teller per tabblad
      let obj = tabCounter;
      obj[tabId]++;
      setTabCounter(obj);
    } else {
      let obj = tabCounter;
      obj[tabId]--;
      setTabCounter(obj);
    }
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

  //to do: via aparte functie in één run zowel buttons maken als de content.
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
            {tab.tabTitle} {tabCounter[`${tab.id}`] ? (<span>({tabCounter[`${tab.id}`]})</span>) : ("")}
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
      <Counter activeFilters={activeFilters}/>
      <button onClick={() => handleSubmitFilter()}>zoek met filter</button>
    </div>
  );
};

export default Tabs;
