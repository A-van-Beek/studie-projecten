import { observer } from "mobx-react-lite";

const TreeItem = observer(
  ({
    data,

    toggleExpanded,
    toggleSelected,
  }) => {
    return (
      <li>
        <span>
          <input
            type="checkbox"
            checked={!!data.expanded}
            onChange={() => toggleExpanded(data)}
            disabled={!data.children}
          />
          <input
            type="checkbox"
            checked={!!data.selected}
            onChange={() => toggleSelected(data)}
          />
          {data.title}
        </span>
        {data.children && data.expanded && (
          <ul>
            {data.children.map((item, idx) => (
              <TreeItem
                key={idx}
                data={item}
                toggleExpanded={toggleExpanded}
                toggleSelected={toggleSelected}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
);

TreeItem.displayName = "TreeItem";

export default observer(function Tree({
  data,

  toggleExpanded,
  toggleSelected,
}) {
  return (
    <ul>
      {data.map((item, idx) => (
        <TreeItem
          key={idx}
          data={item}
          toggleExpanded={toggleExpanded}
          toggleSelected={toggleSelected}
        />
      ))}
    </ul>
  );
});
