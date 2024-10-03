import Header from "./components/Header/Header";
import './App.css'
import { useContext, useEffect } from "react";
import AppContext from './store/app-context'
import { Outlet, useNavigate } from "react-router-dom";


function App() {
  const { login } = useContext(AppContext)

  const Navigate = useNavigate()

  useEffect(() => {
    if (!login) {
      Navigate('/')
    }
  }, [login])


  return (
    <div className="App">
      {/* <Header /> */}
      <Outlet />
    </div>
  );



}

export default App;
