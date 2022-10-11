var _temp, _temp2;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const { Component, createRef } = React;
const { observable, autorun } = mobx;
const { observer } = mobxReact;

//TODO: omzetten naar opbouw zoals ik gewent ben (app.js ; component1.js ; etc)
// TODO: store ombouwen tot separate file
var store = observable({
  todos: [
  {
    id: "1571759209508",
    title: "Learn Mobx",
    completed: false },

  {
    id: "1571759209509",
    title: "Make Mobx Todo App",
    completed: true }],



  addTodo: function (todo) {
    this.todos.push(todo);
  },

  completeTodo: function (id) {
    this.todos = this.todos.map(todo => {
      if (todo.id == id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
  },

  deleteTodo: function (id) {
    this.todos = this.todos.filter(todo => {
      return todo.id != id;
    });
  } });


mobx.autorun(() => {
  // automatische logging dat de store gewijzigd is
  console.log(JSON.stringify(store.todos));
});

const TodoApp = observer((_temp =
class TodoApp extends Component {constructor(...args) {super(...args);_defineProperty(this, "addTodo",

    e => {
      const newTitle = this.refs.textInput.value;

      if (newTitle.length === 0) {
        return;
      }

      this.props.store.addTodo({
        id: Date.now(),
        title: newTitle,
        completed: false });


      this.refs.textInput.value = "";
    });}

  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("h1", null, "MobX leren gebruiken"), /*#__PURE__*/
      React.createElement("div", { className: "container" }, /*#__PURE__*/
      React.createElement("div", { className: "input-section" }, /*#__PURE__*/
      React.createElement("input", { className: "input-area", type: "text", placeholder: "Enter todo", ref: "textInput" }), /*#__PURE__*/
      React.createElement("div", { className: "add-btn", onClick: this.addTodo }, /*#__PURE__*/
      React.createElement("i", { className: "fas fa-plus-circle" }))), /*#__PURE__*/


      React.createElement(TodoList, { store: this.props.store }))));



  }}, _temp));



const TodoList = observer((_temp2 =
class TodoList extends Component {constructor(...args) {super(...args);_defineProperty(this, "handleComplete",
    e => {
      this.props.store.completeTodo(e.target.value);
    });_defineProperty(this, "handleDelete",

    e => {
      this.props.store.deleteTodo(e.target.getAttribute("value"));
    });}

  render() {
    return /*#__PURE__*/(
      React.createElement("section", { className: `todo-list ${this.props.store.todos.length == 0 ? 'hidden' : ''} ` },
      this.props.store.todos.map((todo) => /*#__PURE__*/
      React.createElement(Todo, {
        todo: todo,
        handleComplete: this.handleComplete,
        handleDelete: this.handleDelete }))));




  }}, _temp2));



const Todo = observer(
class Todo extends Component {
  render() {
    const { id, title, completed } = this.props.todo;
    const { handleComplete, handleDelete } = this.props;

    return /*#__PURE__*/(
      React.createElement("div", { className: "todo" }, /*#__PURE__*/
      React.createElement("input", {
        type: "checkbox",
        checked: completed,
        onChange: handleComplete,
        value: id }), /*#__PURE__*/

      React.createElement("span", { className: `title ${completed ? "completed" : ""}` }, title), /*#__PURE__*/
      React.createElement("span", { className: "delete-btn" }, /*#__PURE__*/
      React.createElement("i", { className: "far fa-trash-alt", onClick: handleDelete, value: id }))));



  }});



ReactDOM.render( /*#__PURE__*/React.createElement(TodoApp, { store: store }), document.getElementById("todo-app"));