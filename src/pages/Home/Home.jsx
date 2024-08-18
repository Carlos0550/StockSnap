import React, { useState, useEffect, useRef } from 'react';
import "./home.css";
import NavbarHome from '../../components/NavBar-Home/NavbarHome';
import { Empty, message, Segmented } from 'antd';

import ManageStock from '../../components/Stock/ManageStock';
import { useAppContext } from '../../utils/contexto';
import ManageProviders from '../../components/Proveedores/ManageProviders';
import SalesManager from '../../components/Ventas/SalesManager';
import MoreOptionsManager from '../../components/masopciones/MoreOptionsManager';
import axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate()
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
    "proveedores": <ManageProviders />,
    "ventas": <SalesManager />,
    "másopciones": <MoreOptionsManager />
  }

  const [widthValue, setWidthValue] = useState(0)

  useEffect(() => {
    const handleWidth = () => {
      setWidthValue(window.innerWidth)
    }

    window.addEventListener("resize", handleWidth)

    return () => {
      window.removeEventListener("resize", handleWidth)
    }
  }, [])

  const alreadyShowMessage = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/home") {
      const token = localStorage.getItem("token");

      if (token) {
        if (!alreadyShowMessage.current) {
          alreadyShowMessage.current = true;
          const hiddenMessage = message.loading("Aguarde...");

          (async () => {
            try {
              const response = await axios.post(
                "http://localhost:4000/validate-session",
                { token },
                { headers: { 'Content-Type': 'application/json' } }
              );

              const { code, user } = response.data;

              if (code === 201) {
                // Sesión válida, continuar en la página actual
                // Puedes colocar cualquier lógica adicional aquí si es necesario
              } else if (code === 500) {
                message.error("Error interno del servidor");
                navigate("/");
              } else if (code === 406) {
                message.error("Sesión expirada");
                navigate("/");
              } else {
                // Manejo de otros códigos de error, si es necesario
                navigate("/");
              }
            } catch (error) {
              message.error("Error de red");
              console.error(error);
              navigate("/");
            } finally {
              hiddenMessage(); // Oculta el mensaje de carga
            }
          })();
        }
      } else if(!token && !alreadyShowMessage.current) {
        message.error("No hay token disponible");
        navigate("/");
      }
    }
  }, [location.pathname, navigate]);



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
