import Form from "./components/Form";
import configuration from "./configuration.json" ;
import "./app.css";

function App() {
  // console.log(configuration.styling.global)
  return (
    <div style={configuration.styling.global}>
      <h2 >Let's get started!</h2>
      <Form/>
      <hr/>
    </div>
  );
}

export default App;