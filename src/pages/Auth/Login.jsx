import React, { useEffect, useState } from 'react'
import "./login.css"
function Login() {
    const [values, setValues] = useState({
        user: "",
        password:""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target;

        setValues((prevValue)=> ({
            ...prevValue,
            [name]:value
        }))
    }

    useEffect(()=>{
        console.log(values)
    },[values])
  return (
    <>
        <div className="form-wrapper">
            <form className='form-login'>
                <label htmlFor="user">Ingrese su correo: 
                    <input 
                    type="text" 
                    id='user' 
                    name='user' 
                    value={values.user} 
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
                <button>Iniciar sesión</button>
            </form>
        </div>
    </>
  )
}

export default Login