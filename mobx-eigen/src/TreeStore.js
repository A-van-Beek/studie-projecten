import { makeObservable, observable, action, computed } from "mobx";

class TreeItem {
    title = null;
    value = null;
    children = null;

    selected = false;
    expanded = false;

    constructor(title, value, children) {
        makeObservable(this, {
            title: observable,
            value: observable,
            children: observable,

            selected: observable,
            expanded: observable
        });

        this.title = title;
        this.value = value;
        this.children = children;
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

    // kept alive in case only used in actions
       parents: computed({keepAlive: true}),
    });
  }

  get parents() {
    const map = new Map();

    const findParents = (item) => {
    item.children?.forEach(child => {
        map.set(child, item);
        findParents(child);
    });
    };

    this.value.forEach(findParents);

    return map;
}

  reset() {
    this.value.splice(0);
  }

  addElement() {
    const count = this.value.length;

    const newItem = new TreeItem(`Item ${count}`, null, [
        new TreeItem(`Item ${count}.A`, null, [
            new TreeItem(`Item ${count}.A.I`, "Hello, world! (0)"),
            new TreeItem(`Item ${count}.A.II`, null, [
                new TreeItem(`Item ${count}.A.II.a`, "Hello, world! (1)")
            ])
        ]),
        new TreeItem(`Item ${count}.B`, "Hello, world! (2)")
    ]);

    this.value.push(newItem);
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
    this.#forAllItems(item => {
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

    let parent = parents.get(item);
    while (parent) {
      if (!item.selected && parent.children.find((child) => child.selected)) {
        break;
      }
      parent.selected = item.selected;
      parent = this.parents.get(parent);
    }
  }
}
