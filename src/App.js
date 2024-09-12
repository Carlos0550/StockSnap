import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Inicio/Home";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/*" element={<Home/>}/>
      </Routes>
    </>
  );
}

export default App;
