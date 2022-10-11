import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Tree from './Tree';
import List from './List';
import Values from './Values';
import './App.css';

function App({tree}) {
  const add = () => {
    const count = tree.value.length;

    const newItem = {
      title: `Item ${count}`,
      children: [
          {
              title: `Item ${count}.A`,
              children: [
                  {
                      title: `Item ${count}.A.I`,
                      value: "Hello, world! (0)"
                  },
                  {
                      title: `Item ${count}.A.II`,
                      children: [
                          {
                              title: `Item ${count}.A.II.a`,
                              value: "Hello, world! (1)"
                          }
                      ]
                  }
              ]
          },
          {
              title: `Item ${count}.B`,
              value: "Hello, world! (2)"
          }
      ]
    };

    tree.add(newItem);
  };

  const [amount, setAmount] = useState(10);

  const addMany = () => {
    for (let i = 0; i < amount; i++) {
      add();
    }
  };

  return (
    <div className="App">
      <h1>Demo MobX Tree</h1>
      <button onClick={() => tree.reset()}>Reset</button>
      <button onClick={add}>Add single element</button>
      <input type="text" value={amount} onChange={e => setAmount(e.target.value)}/>
      <button onClick={addMany}>Add many elements</button>
      <button onClick={() => tree.selectAll()}>Select all</button>
      <button onClick={() => tree.deselectAll()}>Deselect all</button>
      <button onClick={() => tree.expandAll()}>Expand all</button>
      <button onClick={() => tree.unexpandAll()}>Unexpand all</button>
      <h2>tree</h2>
      <Tree
        data={tree.value}

        toggleExpanded={item => tree.toggleExpanded(item)}
        toggleSelected={item => tree.toggleSelected(item)}
      />
      <h2>selected</h2>
      <List data={tree.value}/>
      <h2>values</h2>
      <Values data={tree.value}/>
    </div>
  );
}

export default observer(App);
