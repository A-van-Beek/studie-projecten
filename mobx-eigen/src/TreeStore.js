import { makeObservable, observable, action } from "mobx";

class TreeItem {
  parent = null;

  title = null;
  value = null;
  children = null;

  selected = false;
  expanded = false;

  constructor({ parent, title, value, children }) {
    makeObservable(this, {
      title: observable,
      value: observable,
      children: observable,

      selected: observable,
      expanded: observable,
    });

    this.parent = parent;

    this.title = title;
    this.value = value;
    this.children =
      children &&
      children.map((child) => new TreeItem({ parent: this, ...child }));
  }
}

export default class TreeStore {
  value = [];

  constructor() {
    makeObservable(this, {
      value: observable,

      reset: action,
      addElement: action,
      setSelectedAll: action,
      setExpandedAll: action,
      toggleExpanded: action,
      toggleSelected: action,
    });
  }

  reset() {
    this.value.splice(0);
  }

  addElement() {
    const count = this.value.length;

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

    this.value.push(new TreeItem(newItem));
  }

  #forAllItems(f) {
    const visit = (item) => {
      f(item);
      item.children?.forEach(visit);
    };

    this.value.forEach(visit);
  }

  setSelectedAll(value) {
    this.#forAllItems((item) => (item.selected = value));
  }

  setExpandedAll(value) {
    this.#forAllItems((item) => {
      if (item.children) {
        item.expanded = value;
      }
    });
  }

  toggleExpanded(item) {
    item.expanded = !item.expanded;
  }

  toggleSelected(item) {
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

    this.value.forEach(findParents);

    let parent = item.parent;
    while (parent) {
      if (!item.selected && parent.children.find((child) => child.selected)) {
        break;
      }
      parent.selected = item.selected;
      parent = parent.parent;
    }
  }
}
