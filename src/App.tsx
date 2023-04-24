import Home from "./views/Home";
import { Login } from "./views/Login";


function App() {
  return localStorage.getItem("token") ? <Home/> : <Login/>;
}

export default App;
