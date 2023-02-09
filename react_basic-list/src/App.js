import "./App.css";
import Item from "./Item";

function App() {
  return (
    <div className="App">
      <h1>basis</h1>
      <div>test om effect te beoordelen van een unieke key-value in een lijst.</div>
      <div>in console wel een warning indien deze ontbreekt</div>
      <div>is deze wel aanwezig, dan is hij NIET via inspector te zien</div>
      <div>maak je de key niet uniek, dan is de warning aangepast.</div>
      <Item/>
    </div>
  );
}

export default App;
