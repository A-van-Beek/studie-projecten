import './App.css';
import React from 'react';

export default function App() {

  const SPY_INTERVAL = 100;
  
  class Scrollspy extends React.Component {
     constructor(props) {
      super(props);
      this.state = {
        items: []
      };
    }
    
    defaultProps = {
      offset: 2
    };
       
    timer;
  
    spy() {
      const items = this.props.ids
        .map(id => {
          const element = document.getElementById(id);
          if (element) {
            return {
              inView: this.isInView(element),
              element
            };
          } else {
            return;
          }
        })
        .filter(item => item);
  
      const firstTrueItem = items.find(item => !!item && item.inView);
  
      if (!firstTrueItem) {
        return; // dont update state
      } else {
        const update = items.map(item => {
          return { ...item, inView: item === firstTrueItem };
        });
  
        this.setState({ items: update });
      }
    }
  
    componentDidMount() {
      this.timer = window.setInterval(() => this.spy(), SPY_INTERVAL);
    }
  
    componentWillUnmount() {
      window.clearInterval(this.timer);
    }
  
    isInView = (element) => {
      if (!element) {
        return false;
      }
      const { offset } = this.props;
      const rect = element.getBoundingClientRect();
  
      return rect.top >= 0 - offset && rect.bottom <= window.innerHeight + offset;
    };
  
    scrollTo(element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  
    spy() {
      const items = this.props.ids
        .map(id => {
          const element = document.getElementById(id);
          if (element) {
            return {
              inView: this.isInView(element),
              element
            };
          } else {
            return;
          }
        })
        .filter(item => item);
  
      const firstTrueItem = items.find(item => !!item && item.inView);
  
      if (!firstTrueItem) {
        return; // dont update state
      } else {
        const update = items.map(item => {
          return { ...item, inView: item === firstTrueItem };
        });
  
        this.setState({ items: update });
      }
    }
    
    render() {
      const {
        itemContainerClassName,
        activeItemClassName,
        itemClassName
      } = this.props;
      return (
        <ul className={itemContainerClassName}>
          {this.state.items.map((item, k) => {
            return (
              <li
                className={
                  {itemClassName}, {item.inView ? activeItemClassName : null}
                }
                key={k}
                onClick={() => {
                  this.scrollTo(item.element);
                }}
              >
                {item.element.innerText}
              </li>
            );
          })}
        </ul>
      );
    }
}
  
ReactDOM.render(<Scrollspy ids={["One", "Two", "Three", "Four"]}
          itemContainerClassName="scrollSpyContainer"
          activeItemClassName="active"
          itemClassName="spyItemClass"/>, document.getElementById('scrollspy'))};