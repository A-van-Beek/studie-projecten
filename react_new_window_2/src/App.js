import {useState} from "react";
import Popup from "./Popup";
import DepWindow from "./DepWindow";

function App() {
  const [showWindow, setShowWindow] = useState(false);

  return (
    <div>
      <h2>Hier de tweede poging!</h2>
      <Popup/>
        {/* <DepWindow/> */}
    </div>
  );
}

export default App;
