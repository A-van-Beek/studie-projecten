class Model {
  constructor() {
    this.a = 0;
    this.b = 0;
  }

  get count() {
    return this.a + this.b;
  }

  incrementA() {
    this.a += 1;
  }

  incrementB() {
    this.b += 100;
  }}


mobx.decorate(Model, {
  a: mobx.observable,
  b: mobx.observable,
  count: mobx.computed,

  incrementA: mobx.action.bound,
  incrementB: mobx.action.bound });



class VariableComponent extends React.PureComponent {
  render() {
    return /*#__PURE__*/(
      React.createElement("span", null, /*#__PURE__*/
      React.createElement("span", null,
      this.props.name), /*#__PURE__*/

      React.createElement("span", null,
      `(${this.props.value})`)));



  }}



class App extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", null, /*#__PURE__*/
      React.createElement(VariableComponent, {
        name: "A",
        value: this.props.model.a }),

      ' + ', /*#__PURE__*/
      React.createElement(VariableComponent, {
        name: "B",
        value: this.props.model.b }),

      ' = '), /*#__PURE__*/

      React.createElement("div", null,
      this.props.model.count), /*#__PURE__*/

      React.createElement("button", { type: "button", onClick: this.props.model.incrementA },
      'A += 1'), /*#__PURE__*/

      React.createElement("button", { type: "button", onClick: this.props.model.incrementB },
      'B += 100')));



  }}


mobxReact.observer(App);


const model = new Model();


ReactDOM.render( /*#__PURE__*/React.createElement(App, { model: model }), document.body);