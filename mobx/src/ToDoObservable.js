import React from "react";
import ReactDOM from "react-dom";
import { makeAutoObservable, makeObservable, observable, computed, action, autorun } from "mobx";
import { observer } from "mobx-react";


/* ====================================
 * 
 * MobX can automatically execute code that solely depends on state.
 * 
 * In the example below we use makeObservable to show the annotations explicitly,
 * but we could have used makeAutoObservable(this) instead to simplify this process.
 * 
 * observable => value can change over time
 * computed => these can derived from the state and chaches as long as no underlying state changed
 * 
 * In the constructor we created a small function that prints the report and wrapped it in autorun.
 * Autorun creates a reaction that runs once, and after that automatically re-runs whenever any
 * observable data that was used inside the function changes. Because report uses the observable
 * todos property, it will print the report whenever appropriate. This is demonstrated in
 * the next listing. 
 * ====================================*/


class ObservableTodoStore {
  todos = [];
  pendingRequests = 0;

  constructor() {
    makeObservable(this, {
      todos: observable,
      pendingRequests: observable,
      completedTodosCount: computed,
      report: computed,
      addTodo: action,
    });
    autorun(() => console.log(this.report));
  }

  get completedTodosCount() {
    return this.todos.filter((todo) => todo.completed === true).length;
  }

  get report() {
    if (this.todos.length === 0) return "<none>";
    const nextTodo = this.todos.find((todo) => todo.completed === false);
    return (
      `Next todo: "${nextTodo ? nextTodo.task : "<none>"}". ` +
      `Progress: ${this.completedTodosCount}/${this.todos.length}`
    );
  }

  addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null,
    });
  }
}

const observableTodoStore = new ObservableTodoStore();

observableTodoStore.addTodo("read MobX tutorial");
observableTodoStore.addTodo("try MobX");
observableTodoStore.todos[0].completed = true;
observableTodoStore.todos[1].task = "try MobX in own project";
observableTodoStore.todos[0].task = "grok MobX tutorial";
