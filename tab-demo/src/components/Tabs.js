import React, { useState } from "react";
import {dataTabs} from "./dataTabs"
import TabLists from "./TabLists";

const Tabs = () => {
  const [currentTab, setCurrentTab] = useState("tab-1");
  const [selectedTab1, setSelectedTab1] = useState([]);


/** 
 * TODO
 * useState([ {tab 1: [1,2,3,4]}, {} ])
 * 
 * state uitbreiden volgens opzet: [tab-id: {geselecteerde onderwerp-id's}]
 *                  state betere naam geven
 *                  add/remove selected topic hierop aanpassen
 * op basis van deze nieuwe state een teller introduceren (lengte array items) + 
 *                  kleuring tabblad toevoegen
 * knoppen filter verwijderen toevoegen per tab en voor totale selectie
 * knop toevoegen voor run filter
 * overzetten naar viewer
 * 
 * inspiratie:      https://mui.com/material-ui/react-tabs/
 * code gebruikt:   https://rojaslabs.github.io/react-simple-tabs/
 *                  https://github.com/rojaslabs/react-simple-tabs
 * nakijken:        https://dev.to/andyrewlee/cheat-sheet-for-updating-objects-and-arrays-in-react-state-48np
 * 
 * 
*/


  const handleTabClick = (e) => {
    setCurrentTab(e.target.id);
    console.log("currentTab", currentTab)
    console.log("geklikt op", e.target)
  };

  function addSelectedTopic(e, id) {
    const { checked } = e.target;
    if (checked) {
        setSelectedTab1(prev => [...prev, id])
    } else {
        setSelectedTab1(prev => prev.filter(x => x !== id))
    }
    console.log("state selectedTab1", selectedTab1)
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
                <TabLists contentItems={tab.contentItems} addSelectedTopic={addSelectedTopic}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
