import Tree from "./Tree";
import List from "./List";
import Values from "./Values";
import "./App.css";

function App({tree}) {

  return (
    <div className="App">
      <h1>Demo MobX Tree</h1>
      <button onClick={() => tree.reset()}>Reset</button>
      <button onClick={() => tree.addElement()}>Add element</button>
      <button onClick={() => tree.setSelectedAll(true)}>Select all</button>
      <button onClick={() => tree.setSelectedAll(false)}>Deselect all</button>
      <button onClick={() => tree.setExpandedAll(true)}>Expand all</button>
      <button onClick={() => tree.setExpandedAll(false)}>Unexpand all</button>
      <h2>tree</h2>
      <Tree
        data={tree.value}
        toggleExpanded={item => tree.toggleExpanded(item)}
        toggleSelected={item => tree.toggleSelected(item)}
      />
      <h2>selected</h2>
      <List data={tree.value} />
      <h2>values</h2>
      <Values data={tree.value} />
    </div>
  );
}

export default App;
