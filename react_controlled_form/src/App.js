import Form from "./components/Form";
import LoginForm from "./components/Login";
import Inputfield from "./components/Inputfield" 

function App() {
  return (
    <div>
      <h2>Let's get started!</h2>
      <Form/>
      <hr/>
      <LoginForm/>
      <hr/>
      <Inputfield/>
    </div>
  );
}

export default App;
