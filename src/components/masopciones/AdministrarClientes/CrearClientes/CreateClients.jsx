import React, { useState } from 'react'
import { TextField } from "@mui/material"
import { Button, Divider, Flex, message, Spin } from 'antd';
import "./createClients.css"
import { useAppContext } from '../../../../utils/contexto';
function CreateClients() {
    const { createCLients } = useAppContext()
    const [values, setValues] = useState({
        nombre_completo: "",
        dni: "",
        apodo: "",
        direccion: "",
        telefono:"",

    });

    const [errors, setErrors] = useState({
        nombre_completo: "",
        dni: "",
        apodo: "",
        direccion: "",
        telefono:"",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }))
    }
    const validateDni = (dni) => {
        const dniPattern = /^[0-9]{7,8}?$/
        const trimmedDni = dni.trim()
        return dniPattern.test(trimmedDni)
    }
    const [isProcessing, setIsProcessing] = useState(false)
    const handleSubmit = async () => {
        let valid = true;
        const newErrors = {};

        if (!values.nombre_completo ) {
            newErrors.nombre_completo = "El nombre no puede estar vacio."
            valid = false;
        }
        if (!values.dni || !validateDni(values.dni)) {
            newErrors.dni = "El DNI no es válido"
            valid = false;
        }

        if (!values.telefono) {
            newErrors.telefono = "El télefono es requerido"
            valid = false
        }

        setErrors(newErrors);

        if (valid) {
            setIsProcessing(true)
            await createCLients(values)
            setIsProcessing(false)
            setValues({
                nombre_completo: "",
                dni: "",
                apodo: "",
                direccion: "",
                telefono:"",
            });
            setErrors({
                nombre_completo: "",
                dni: "",
                telefono:"",
            })
        }
    }
    return (
        <>
            <div className="create-client-container">
                <TextField
                    id='nombre_completo'
                    error={!!errors.nombre_completo}
                    helperText={errors.nombre_completo}
                    name='nombre_completo'
                    label="Ingresa el nombre completo del cliente"
                    value={values.nombre_completo}
                    className='textfield__create-client'
                    onChange={handleChange}
                    disabled={isProcessing}

                />
                <TextField
                    id='dni'
                    className='textfield__create-client'
                    name='dni'
                    label="DNI del cliente"
                    value={values.dni}
                    error={!!errors.dni}
                    helperText={errors.dni}
                    onChange={handleChange}
                    disabled={isProcessing}

                />
                <TextField
                    id='apodo'
                    name='apodo'
                    className='textfield__create-client'
                    label="Ingrese algun alias o apodo para este cliente"
                    value={values.apodo}
                    onChange={handleChange}
                    disabled={isProcessing}
                />

                <Divider>Contacto</Divider>

                <TextField
                    id='telefono'
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    name='telefono'
                    label="Ingresa el contacto del cliente"
                    value={values.telefono}
                    className='textfield__create-client'
                    onChange={handleChange}
                    disabled={isProcessing}

                />
                <TextField
                    id='direccion'
                    className='textfield__create-client'
                    name='direccion'
                    label="Domicilio del cliente"
                    value={values.direccion}
                    error={!!errors.direccion}
                    helperText={errors.direccion}
                    onChange={handleChange}
                    disabled={isProcessing}

                />
                

            </div>
            <Button disabled={isProcessing} onClick={handleSubmit} className='btn_save-client'>{isProcessing ? <Spin /> : "Guardar cliente"}</Button>

        </>
    )
}

export default CreateClients