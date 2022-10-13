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
      add: action,

      selectAll: action,
      deselectAll: action,

      expandAll: action,
      unexpandAll: action,

      toggleExpanded: action,
      toggleSelected: action,
    });
  }

  reset() {
    this.value.splice(0);
  }

  add(newItem) {
    this.value.push(new TreeItem(newItem));
  }

  #forAllItems(f) {
    const visit = (item) => {
      f(item);
      item.children?.forEach(visit);
    };

    this.value.forEach(visit);
  }

  selectAll() {
    this.#forAllItems((item) => (item.selected = true));
  }

  deselectAll() {
    this.#forAllItems((item) => (item.selected = false));
  }

  expandAll() {
    this.#forAllItems((item) => (item.expanded = !!item.children));
  }

  unexpandAll() {
    this.#forAllItems((item) => (item.expanded = false));
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
