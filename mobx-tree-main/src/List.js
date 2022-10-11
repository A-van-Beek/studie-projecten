import { observer } from "mobx-react-lite"

export default observer(function List({
    data
}) {
    const mapper = (item) =>
        item.children
            ? [item, ...item.children?.flatMap(mapper)]
            : [item];

    return (
        <ul>{data.flatMap(mapper)
            .map((item, idx) => ({key: idx, item}))
            .filter(({item}) => item.selected)
            .map(({item, key}) => <li key={key}>{item.title}</li>)}
        </ul>
    );
});
