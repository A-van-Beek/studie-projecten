import Form from "./components/Form";
import configuration from "./configuration.json" ;
import "./app.css";
import "./variables.css"

function App() {
  console.log("configuratie: ", configuration.styling.global["--theme-secondary-color-light"])

  return (
    <div className="this-app" style={configuration.styling.global}>
      <h2 >Let's get started!</h2>
      <Form/>
      <hr/>
      <br/>
      <div className="test">en hier mist iets, dus fall-back kleur</div>
    </div>
  );
}

export default App;