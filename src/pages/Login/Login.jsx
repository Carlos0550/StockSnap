import { Button, Form, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import "./login.css"
import { useAppContext } from '../../utils/contexto'
function Login() {
    const [form] = Form.useForm()
    const { loginUser,checkSession } = useAppContext()
    const [isLoading, setIsLoading] = useState()
    const onFinish = async(values) =>{
        setIsLoading(true)
        await loginUser(values)
        setIsLoading(false)
    }

    useEffect(()=>{
        (async()=>{
            setIsLoading(true)
            await checkSession()
            setIsLoading(false)
        })()
    },[])
  return (
    <div className='login__main-wrapper'>
        <div className="login__wrapper">
            <h1>Bienvenido de nuevo</h1>
            <Form
            form={form}
            name='login'
            onFinish={onFinish}
            layout='vertical'
            >
                <Form.Item
                label="Email de identificación"
                name="email"
                rules={[
                    {
                        required: true,
                        message: "Por favor, ingresa el correo de identificación",
                        type: "email"
                    }
                ]}
                >
                    <Input placeholder=''/>
                </Form.Item>
                <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese su contraseña!"
                        }
                    ]}
                >
                    <Input.Password placeholder='Ingrese su contraseña'/>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>Iniciar sesión</Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  )
}

export default Login