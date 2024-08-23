import React, { useEffect, useRef, useState } from 'react'
import {message, Spin} from "antd"
import axios from "axios"
import "./login.css"
import {useNavigate} from "react-router-dom"
function Login() {
const navigate = useNavigate()
const alreadyShowMessage = useRef(false)
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token && !alreadyShowMessage.current) {
    alreadyShowMessage.current = true;
    const hiddenMessage = message.loading("Aguarde...", 0);

    (async () => {
      try {
        const response = await axios.post(
          "https://stocksnap-server.vercel.app/validate-session",
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const { code } = response.data;

        if (code === 201) {
          message.success("Sesión válida");
          setTimeout(() => navigate("/home"), 1000);
        } else if (code === 406) {
          message.error("Sesión expirada");
        } else if (code === 500) {
          message.error("Error interno del servidor, por favor recargue la pagina", 4);
        }
      } catch (error) {
        console.error(error);
        message.error("Error de conexión", 3);
      } finally {
        hiddenMessage();
      }
    })();
  } else if (!token && !alreadyShowMessage.current) {
    message.error("No hay token disponible");
  }
}, [navigate]);


    const [values, setValues] = useState({
        email: "",
        password:""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target;

        setValues((prevValue)=> ({
            ...prevValue,
            [name]:value
        }))
    }
    const [processing, setProcessing] = useState(false)
    const handleSubmit = async (e) => {
      e.preventDefault();
      const hiddenMessage = message.loading("Iniciando sesión", 0);
      setProcessing(true);
  
      try {
          const response = await axios.post("https://stocksnap-server.vercel.app/login", values);
          const { code, token, user } = response.data;
          if (code === 500) {
              message.error("Error interno del servidor, por favor intente nuevamente", 3);
          } else if (code === 400) {
              message.error("Usuario o contraseña incorrectos", 3);
          } else if (code === 406) {
              message.error("El usuario o contraseña es inválido, por favor verifique que los campos estén correctos", 3);
          } else if (token) {

              localStorage.setItem('token', token);
              message.success("Usuario logueado con éxito");
              navigate("/home");
          } else {
              message.error("Respuesta inesperada del servidor", 3);
          }
  
      } catch (error) {
          console.error("Error en el inicio de sesión:", error);
          if (error.response) {
              message.error(`Error: ${error.response.data.message || "Desconocido"}`, 3);
          } else {
              message.error("Error de red o conexión", 3);
          }
      } finally {
          hiddenMessage(); // Finalizar el mensaje de carga
          setProcessing(false);
      }
  };

    // useEffect(()=>{
    //     console.log(values)
    // },[values])
  return (
    <>
        <div className="form-wrapper">
            <form className='form-login'>
                <label htmlFor="email">Ingrese su correo: 
                    <input 
                    type="text" 
                    id='email' 
                    name='email' 
                    value={values.email} 
                    placeholder='Jhon@gmail.com' 
                    onChange={handleChange}/>
                </label>
                <label htmlFor="user">Ingrese su contraseña:
                    <input 
                    type="text" 
                    id='user' 
                    name='password' 
                    value={values.password} 
                    placeholder='123456' 
                    onChange={handleChange}/>
                </label>
                <button disabled={processing} onClick={handleSubmit}>{processing ? <Spin/> : "Iniciar sesión"}</button>
            </form>
        </div>
    </>
  )
}

export default Login