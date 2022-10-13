import { observable, action } from "mobx";
import Tree from "./Tree";
import "./App.css";

export default function App() {
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
            },
            {
              title: `Item ${count}.A.II`,
              children: [
                {
                  title: `Item ${count}.A.II.a`,
                },
              ],
            },
          ],
        },
        {
          title: `Item ${count}.B`,
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
  });

  return (
    <div className="App">
      <h1>Demo MobX Tree</h1>
      <Tree
        data={tree}
        toggleExpanded={toggleExpanded}
        toggleSelected={toggleSelected}
      />
      <button onClick={addElement}>Add element</button>
    </div>
  );
}
