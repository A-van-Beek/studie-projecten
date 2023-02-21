import React from "react";

import { DepWindow } from "./dep-window";

export class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      showWindowPortal: false
    };

    this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
    this.closeWindowPortal = this.closeWindowPortal.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", () => {
      this.closeWindowPortal();
    });

    // window.setInterval(() => {
    //   this.setState(state => ({
    //     counter: state.counter + 1
    //   }));
    // }, 1000);
  }

  toggleWindowPortal() {
    this.setState(state => ({
      ...state,
      showWindowPortal: !state.showWindowPortal
    }));
  }

  closeWindowPortal() {
    this.setState({ showWindowPortal: false });
  }

  render() {
    return (
      <div>
        <h1>Counter: {this.state.counter}</h1>

        <button onClick={this.toggleWindowPortal}>
          {this.state.showWindowPortal ? "Close the" : "Open a"} Portal
        </button>

        {this.state.showWindowPortal && (
          <DepWindow closeWindowPortal={this.closeWindowPortal}>
            {/* <h1>Counter in a portal: {this.state.counter}</h1> */}
            <h1>hier is de inhoud van het portal</h1>
            <p>Even though I render in a different window, I share state!</p>

            <button onClick={this.closeWindowPortal}>Close me!</button>
          </DepWindow>
        )}
      </div>
    );
  }
}
