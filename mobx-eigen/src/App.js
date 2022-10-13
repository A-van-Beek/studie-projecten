import { observable, action } from "mobx";
import Tree from "./Tree";
import List from "./List";
import Values from "./Values";
import "./App.css";

function App() {
  const tree = observable([]);
  const addElement = action(() => {
    const count = tree.length;
    const newItem = {
      title: `Item ${count}`,
      children: [
        {
          title: `Item ${count}.A`,
          children: [
            {
              title: `Item ${count}.A.I`,
              value: "Hello, world! (0)",
            },
            {
              title: `Item ${count}.A.II`,
              children: [
                {
                  title: `Item ${count}.A.II.a`,
                  value: "Hello, world! (1)",
                },
              ],
            },
          ],
        },
        {
          title: `Item ${count}.B`,
          value: "Hello, world! (2)",
        },
      ],
    };

    tree.push(newItem);
  });
  const toggleExpanded = action((item) => {
    item.expanded = !item.expanded;
  });
  const toggleSelected = action((item) => {
    item.selected = !item.selected;
    const updateChildren = (item) => {
      item.children?.forEach((child) => {
        child.selected = item.selected;
        updateChildren(child);
      });
    };
    updateChildren(item);
    const parents = new Map();
    const findParents = (item) => {
      item.children?.forEach((child) => {
        parents.set(child, item);
        findParents(child);
      });
    };
    tree.forEach(findParents);
    let parent = parents.get(item);
    while (parent) {
      if (!item.selected && parent.children.find((child) => child.selected)) {
        break;
      }
      parent.selected = item.selected;
      parent = parents.get(parent);
    }
  });
  return (
    <div className="App">
      <h1>Demo MobX Tree</h1>
      <button onClick={addElement}>Add element</button>
      <h2>tree</h2>
      <Tree
        data={tree}
        toggleExpanded={toggleExpanded}
        toggleSelected={toggleSelected}
      />
      <h2>selected</h2>
      <List data={tree} />
      <h2>values</h2>
      <Values data={tree} />
    </div>
  );
}

export default App;
