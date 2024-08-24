import React, { useState, useEffect, useRef } from 'react';
import "./home.css";
import NavbarHome from '../../components/NavBar-Home/NavbarHome';
import { message, Segmented } from 'antd';
import ManageStock from '../../components/Stock/ManageStock';
import { useAppContext } from '../../utils/contexto';
import ManageProviders from '../../components/Proveedores/ManageProviders';
import SalesManager from '../../components/Ventas/SalesManager';
import MoreOptionsManager from '../../components/masopciones/MoreOptionsManager';
import AnaliticsDashboard from './Analiticas/AnaliticsDashboard';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const options = ["Inicio", "Stock", "Proveedores", "Ventas", "Más opciones"];
  const [selectedOption, setSelectedOption] = useState('inicio');
  const [showContent, setShowContent] = useState(false);
  const { sistemLoading } = useAppContext();
  const [isLoadingAll, setIsLoadingAll] = useState(true); 
  const [animationDone, setAnimationDone] = useState(false); 
  const [widthValue, setWidthValue] = useState(0);
  
  const alreadyShowMessage = useRef(false);
  const location = useLocation();

  const componentMap = {
    "inicio": <AnaliticsDashboard />,
    "stock": <ManageStock />,
    "proveedores": <ManageProviders />,
    "ventas": <SalesManager />,
    "másopciones": <MoreOptionsManager />
  };

  useEffect(() => {
    if (location.pathname === "/home") {
      const token = localStorage.getItem("token");

      if (token && !alreadyShowMessage.current) {
        alreadyShowMessage.current = true;
        const hiddenMessage = message.loading("Aguarde...");

        (async () => {
          try {
            const response = await axios.post(
              "https://stocksnap-server.vercel.app/validate-session",
              { token },
              { headers: { 'Content-Type': 'application/json' } }
            );

            const { code } = response.data;

            if (code === 201) {
              setIsLoadingAll(false);
            } else {
              message.error("Sesión expirada o error de servidor");
              navigate("/");
            }
          } catch (error) {
            message.error("Error de red");
            navigate("/");
          } finally {
            hiddenMessage();
          }
        })();
      } else if (!token) {
        message.error("No hay token disponible");
        navigate("/");
      }
    }
  }, [location.pathname, navigate]);


  useEffect(() => {
    if (!isLoadingAll) {
      const animationTimer = setTimeout(() => {
        setAnimationDone(true); 
      }, 1000); 

      return () => clearTimeout(animationTimer);
    }
  }, [isLoadingAll]);

  useEffect(() => {
    const handleWidth = () => setWidthValue(window.innerWidth);
    window.addEventListener("resize", handleWidth);
    return () => window.removeEventListener("resize", handleWidth);
  }, []);

  return (
    <>
      <NavbarHome />
      <div className='home__wrapper' style={{ paddingTop: ".5rem", maxWidth: "100%", padding: ".5rem", minHeight: selectedOption !== "inicio" ? "100vh" : "15vh", marginTop: selectedOption !== "inicio" ? "0" : widthValue < 768 ? "0" : "1rem", borderRadius: selectedOption !== "inicio" ? "0 0 10px 10px" : "10px" }}>      
        <div className="hero">
          <h1>Bienvenido a Stock Snap</h1>
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
                    message.info(`Cambiando a ${value}`, 1);
                    break;
                  case "stock":
                  case "proveedores":
                  case "ventas":
                    message.info(`Cambiando a ${value}`, 1);
                    break;
                  default:
                    message.info("Seleccione una opción", 1);
                }
              }}
            />
          </div>
        </div>

        <div className={isLoadingAll ? "loading-container" : animationDone ? "animate-container" : "desanimate-container"} style={{}}>
          {!isLoadingAll && animationDone && (
            componentMap[selectedOption]
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
