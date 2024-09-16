import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { supabase } from "../supabase";
import { message, Result, Button, Modal } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useLocation, useNavigate } from "react-router-dom";
import { config } from "../config";
export const AppContext = createContext();

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return ctx;
};

export const AppContextProvider = ({ children }) => {
  dayjs.extend(timezone);
  dayjs.extend(utc);
  const getFullDate = dayjs().tz("America/Argentina/Buenos_Aires");
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    admin: false,
    default_user: false,
    id: null,
    access_token: null,
  });
  const [clientes,setClientes] = useState([])
  const [productos,setProductos] = useState([])
  const [proveedores,setProveedores] = useState([])
  const [ventas,setVentas] = useState([])
  const [cart, setCart] = useState([])


  const loginUser = async (values) => {
    const hiddenMessage = message.loading("Aguarde...");

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/verify-auth-user`,
        { email: values.email }
      );
      if (response.status === 404) {
        message.error("Usuario no encontrado o no registrado", 3);
        return;
      } else if (response.status === 200) {
        const { admin, default_user } = response.data;

        setUserInfo((prevState) => ({
          ...prevState,
          admin,
          default_user,
        }));

        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          message.error("Hubo un error al iniciar sesión");
          hiddenMessage();
          return;
        }

        if (data) {
          setUserInfo((prevState) => ({
            ...prevState,
            id: data.user.id,
            access_token: data.session.access_token,
          }));
          navigate("/home")
        }
        navigate("/")
      }
    } catch (error) {
      console.error("Error en la función logAdmin:", error);
      if (error.response) {
        if (error.response.status === 404) {
            message.error("Usuario no encontrado o no registrado", 3);
            return;
        }
      }
      message.error("Hubo un error en la solicitud");

    } finally {
      hiddenMessage();
    }
  };

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session) {
        const email = session.user.email;

        const response = await axios.post(
          `${config.apiBaseUrl}/verify-auth-user`,
          { email }
        );
        const { admin, default_user } = response.data;

        setUserInfo({
          admin,
          default_user,
          id: session.user.id,
          access_token: session.access_token,
        });
        navigate("/home")
      } else {
        setUserInfo({
          admin: false,
          default_user: false,
          id: null,
          access_token: null,
        });
        navigate("/")
      }
    } catch (error) {
      message.error("Error al verificar la sesión");
      console.error("Error en checkSession:", error);
    }
  };

  const fetchAllResources = async() => {
    const hiddenMessage = message.loading("Aguarde...",0)
    try {
        const response = await axios.get(`${config.apiBaseUrl}/fetch-all-resources`)
        if (response.status === 200) {
            hiddenMessage()
            setClientes(response.data.clientes);
            setProductos(response.data.productos);
            setProveedores(response.data.proveedores);
            setVentas(response.data.ventas);
        }else{
            message.error(`${response.data.message}`)
        }
    } catch (error) {
        console.log(error)
        if (error.response) {
            message.error(`${error.response.data.message}`,5)
        }
        message.error("Error de red: Verifique su conexión e intente nuevamente",5)
    }finally{
        hiddenMessage()
    }
  }

  const addProvider = async(provider) => {
    const hiddenMessage = message.loading("Aguarde...",0)
    try {
      const response = await axios.post(`${config.apiBaseUrl}/add-provider`, {provider})
      hiddenMessage()
      if (response.status === 200) {
        message.success(`${response.data.message}`)
        return 200;
      }else{
        message.error(`${response.data.message}`,3)
        return;
      }
    } catch (error) {
      hiddenMessage()
      console.log(error)
      if (error.response) {
        message.error(`${error.response.data.message}`,3)
      }else{
        message.error("Error de conexión, verifica tu internet e intenta nuevamente",3)
      }
      return
    }
  }

  const updateProvider = async(provider,idProveedor) => {
    const hiddenMessage = message.loading("Aguarde...",0)
    try {
      const response = await axios.put(`${config.apiBaseUrl}/edit-provider?id_proveedor=${idProveedor}`, {provider})
      hiddenMessage()
      if (response.status === 200) {
        message.success(`${response.data.message}`)
        return 200;
      }else{
        message.error(`${response.data.message}`,3)
        return;
      }
    } catch (error) {
      hiddenMessage()
      console.log(error)
      if (error.response) {
        message.error(`${error.response.data.message}`,3)
      }else{
        message.error("Error de conexión, verifica tu internet e intenta nuevamente",3)
      }
      return
    }
  }

  return (
    <AppContext.Provider
      value={{
        getFullDate,
        loginUser,
        checkSession,
        userInfo,
        fetchAllResources,
        clientes,
        productos,
        proveedores,
        ventas,
        cart, 
        setCart,
        addProvider,
        updateProvider
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
