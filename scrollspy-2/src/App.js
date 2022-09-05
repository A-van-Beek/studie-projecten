import { WithNavMenu } from "./NavMenu";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <WithNavMenu selector="section">
        <section id="section1" data-nav-title="Section 1" data-scrollspy />
        <section id="section2" data-nav-title="Section 2" data-scrollspy />
        <section id="section3" data-nav-title="Section 3" data-scrollspy />
        <section id="section4" data-nav-title="Section 4" data-scrollspy />
        <section id="section5" data-nav-title="Section 5" data-scrollspy />
        <section id="section6" data-nav-title="Section 6" data-scrollspy />
      </WithNavMenu>
    </div>
  );
}
