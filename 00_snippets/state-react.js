//de useState-hook kan alleen gebruikt worden in een functionele component.
//dus:
// export default function App() {
//   return (
//     <div>blabla</div>
//   )
// }

// en niet:
// class App extends React.Component{

// }

import React from "react";

const [filterLists, setFilterLists] = useState([
  { idItem: 1, annotatieTitle: "100-jaarsaandachtsgebied", checked: false },
  { idItem: 2, annotatieTitle: "Aandachtsgebied stiltegebied", checked: false },
  { idItem: 3, annotatieTitle: "Aardkundige waarden", checked: false },
  { idItem: 4, annotatieTitle: "Agrarisch cultuurlandschap", checked: false },
  { idItem: 5, annotatieTitle: "Agrarische bedrijven", checked: false },
  { idItem: 21, annotatieTitle: "instructieregel", checked: false },
  { idItem: 22, annotatieTitle: "regelvooriedereen", checked: false },
  { idItem: 23, annotatieTitle: "Bodemthema", checked: false },
  { idItem: 24, annotatieTitle: "CultureelErfgoedthema", checked: false },
  { idItem: 26, annotatieTitle: "Infrastructuurlocatie", checked: false },
  { idItem: 27, annotatieTitle: "Landgebruiklocatie", checked: false },
]);



// organiseren van initiële state van een tellertje
const [tabCounter, setTabCounter] = useState([]);

//(arrow)functie om de teller te wijzigen
const countSelectedItems = (tabId, item) => {
    if (item.checked) {
      //ophogen / verlagen van teller per tabblad
      let obj = {...tabCounter}; //hier maar je een 'kopie' van de huidige state
      obj[tabId]++; //hier tel je bij het tijdelijke object ééntje op.
      setTabCounter(obj); // vervang huidige state door nieuwe state
    } else {
      let obj = {...tabCounter};
      obj[tabId]--;
      setTabCounter(obj);
    }
  }

  // indien state alleen één element bevat en oude state niet relevant is,
  // dan mag deze wijze:
  const [currentTab, setCurrentTab] = useState("tab-1");
  const handleTabClick = (e) => {
    setCurrentTab(e.target.id);
  };


  /** ==================================
   * verschillende manieren van gebruik van de spread operator
   * voor objecten: {...objectNaam}
   * voor arrays: [...arrayNaam]
   * 
  ================================== */




  /** ==================================
   * voorbeeld vanuit video: https://www.youtube.com/watch?v=GGo3MVBFr1A&ab_channel=WebDevSimplified
   * 
  ================================== */

  const [count, setCount] = useState(0);

  function adjustCount(amount) {
    setCount(currentCount => {
      return currentCount + amount
    })
  }

  // NB indien je met een console/log het effect wilt zien, dan moet je wachten
  // tot de component opnieuw gerenderd wordt.
  // oplossing:

  useEffect(() => {
    console.log(count)
  }, [count])
  


