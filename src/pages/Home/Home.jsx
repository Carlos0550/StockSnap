import React, { useState, useEffect } from 'react';
import "./home.css";
import NavbarHome from '../../components/NavBar-Home/NavbarHome';
import { Empty, message, Segmented } from 'antd';

import ManageStock from '../../components/Stock/ManageStock';
import { useAppContext } from '../../utils/contexto';
import ManageProviders from '../../components/Proveedores/ManageProviders';
function Home() {
  const options = ["Inicio", "Stock", "Proveedores", "Ventas", "Más opciones"];
  const [padding, setPadding] = useState('1rem');
  const [selectedOption, setSelectedOption] = useState('inicio');
  const [showContent, setShowContent] = useState(false);
  const { sistemLoading } = useAppContext()
  useEffect(() => {
    if (selectedOption !== "inicio") {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [selectedOption]);


  const componentMap = {
    "inicio": "",
    "stock": <ManageStock />,
    "proveedores": <ManageProviders/>,
    "ventas": <Empty/>,
    "másopciones": <Empty/>
  }

  const [widthValue, setWidthValue] = useState(0)

  useEffect(()=>{
    const handleWidth = () =>{
      setWidthValue(window.innerWidth)
    }

    window.addEventListener("resize", handleWidth)

    return () =>{
      window.removeEventListener("resize", handleWidth)
    }
  },[])

  return (
    <>
      <NavbarHome />

      <div className='home__wrapper' style={{ paddingTop: ".5rem", maxWidth: selectedOption !== "inicio" ? "100%" : widthValue < 768 ? "100%" : "80%", minHeight: selectedOption !== "inicio" ? "100vh" : "15vh", marginTop: selectedOption !== "inicio" ? "0" : widthValue < 768 ? "0" : "1rem", borderRadius: selectedOption !== "inicio" ? "0 0 10px 10px" : "10px" }}>
        <div className="hero">
          <h1>StockSnap - Gestión de inventario</h1>
          <div>
            <Segmented
              options={options}
              disabled={sistemLoading}
              size={widthValue < 768 ? 'small' : 'large'}
              onChange={value => {
                const valor = value.replaceAll(" ", "").toLowerCase();
                setSelectedOption(valor);

                switch (valor) {
                  case "inicio":
                    setPadding("1rem");
                    message.info(`Cambiando a ${value}`, 1);
                    break;
                  case "stock":
                  case "proveedores":
                  case "ventas":
                    setPadding('5rem');
                    message.info(`Cambiando a ${value}`, 1);
                    break;
                  default:
                    message.info("Seleccione una opción", 1);
                }
              }}
            />


          </div>

          

        </div>
        <div className={selectedOption !== "inicio" ? "animate-container" : "desanimate-container" || widthValue < 768 ? "animate-container" : "inherit"}>
            {showContent && (
              componentMap[selectedOption]
            )}
          </div>
      </div>
    </>
  );
}

export default Home;
