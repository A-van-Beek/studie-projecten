import React from "react";
import { observer } from "mobx-react-lite";
import "./Values.css";

export default observer(function Values({ data }) {
  const mapper = (depth) => (item) =>
    [{ depth, item }, ...(item.children?.flatMap(mapper(depth + 1)) || [])];

  return (
    <div className="values">
      {data
        .flatMap(mapper(1))
        .map((item, idx) => ({ key: idx, ...item }))
        .filter(({ item }) => item.selected)
        .map(({ depth, item, key }) => (
          <React.Fragment key={key}>
            {React.createElement(`h${depth}`, {}, item.title)}
            {item.value && <p>{item.value}</p>}
          </React.Fragment>
        ))}
    </div>
  );
});
