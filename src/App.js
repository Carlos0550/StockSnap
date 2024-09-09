import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Inicio/Home";
import StockAndCategoriesManager from "./pages/Stock y categorias/StockAndCategoriesManager";
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
