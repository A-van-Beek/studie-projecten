import {useState} from "react";
import Popup from "./Popup";
// import DepWindow from "./DepWindow";
//vraagteken of deze juist werkt !!

function App() {
  const [showWindow, setShowWindow] = useState(false);

  const toggleWindow = (e) => {
    e.preventDefault()
    console.log("geklikt")
    setShowWindow(!showWindow)
  }

  return (
    <div>
      <h2>Hier de tweede poging!</h2>
      <Popup toggleWindow={toggleWindow} showWindow={showWindow}/>

    </div>
  );
}

export default App;
