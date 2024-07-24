import Header from "./components/Header/Header";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import './App.css'
import MCQMenu from "./components/MCQMenu/MCQMenu";
import Games from "./components/Games/Games";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Header />
      <Outlet />
      {/* <Signup /> */}
      {/* <Home /> */}
      {/* <MCQMenu /> */}
      {/* <Games /> */}
    </div>
  );
}

export default App;
