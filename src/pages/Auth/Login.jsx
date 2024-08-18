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

      const hiddenMessage = message.loading("Validando sesión", 0); // 0 para que no desaparezca automáticamente

      (async () => {
        try {
          const response = await axios.post(
            "http://localhost:4000/validate-session",
            { token },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { code, user } = response.data;

          if (code === 201) {
            message.success("Sesión válida")
            setTimeout(() => {
                navigate("/home");
            }, 1000);
          } else if (code === 500) {
            message.error("Error interno del servidor, por favor recargue la pagina",4);
            setTimeout(() => window.location.reload(), 2000);
          } else if (code === 406) {
            message.error("Sesión expirada");
            setTimeout(() => window.location.reload(), 2000);
          }
        } catch (error) {
          message.error("Error de red, por favor recargue la pagina",4);
          
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
    const handleSubmit = async(e) =>{
        e.preventDefault()
        const hiddenMessage = message.loading("Iniciando sesión",0)
        setProcessing(true)
        try {
            const response = await axios.post("http://localhost:4000/login", values)
            console.log("Respuesta del servidor: ",response.data)
            const {token,user} = response.data
            if (response.data?.code === 500) {
                message.error("Error interno del servidor, por favor intente nuevamente",3)
            }else if(response.data?.code === 400){
                message.error("Usuario o contraseña incorrectos",3)
            }else if(response.data?.code === 406){
                message.error("El usuario o contraseña es inválido, por favor verifique que los campos esten correctos",3)
            } else{
                
                localStorage.setItem('token',token)
                message.success("Usuario logueado con exito")
                navigate("/home")
            }
            

        } catch (error) {

        }finally{
            hiddenMessage()
            setProcessing(false)
        }
    }

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