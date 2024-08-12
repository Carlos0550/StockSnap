import { TextField } from '@mui/material';
import { Button, message } from 'antd';
import React, { Children, useEffect, useState } from 'react'
import { useAppContext } from '../../../utils/contexto';
import { Collapse } from "antd"
import TableCategories from './TableCategories';
function ManageCategories() {
    const [isSaving, setIsSaving] = useState(false)
    const { insertCategories } = useAppContext()
    const [values, setValues] = useState({
        nombre_categoria: "",
        descripcion: ""
    })

    const [errors, setErrors] = useState({
        nombre_categoria: "",
        descripcion: ""
    })

    const handleValues = (e) => {
        const { id, value } = e.target;
        setValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [id]: (id !== "descripcion" && value.trim() === "") ? "Este campo es obligatorio" : ""
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}
        let hasError = false;

        Object.keys(values).forEach(key => {
            if (key !== "descripcion" && values[key].trim() === "") {
                newErrors[key] = "Este campo es obligatorio"
                hasError = true
            }
        })

        setErrors(newErrors)

        if (!hasError) {
            setIsSaving(true)
            await insertCategories(values)
            setIsSaving(false)
            setValues([])
        }
    }

    const capitalizeLabel = (label) => {
        const firtLetter = label.charAt(0)
        return label
            .replace("_", " ")
            .toLowerCase()
            .replace(firtLetter, char => char.toUpperCase())
    }
    const keys = Object.keys(values)

    const RenderUploadCategories = () => {
        return (
            <>
                <div className="manage__categories-container">
                    <div className="flex-cont">
                        {keys.map((key, index) => (
                            <React.Fragment key={index}>

                                <TextField
                                    id={key}
                                    label={capitalizeLabel(key)}
                                    value={values[key]}
                                    onChange={handleValues}
                                    fullWidth
                                    margin='normal'
                                    error={!!errors[key]}
                                    helperText={errors[key]}
                                />

                            </React.Fragment>
                        ))}
                    </div>
                    <Button type='primary' onClick={handleSubmit} disabled={isSaving}>Guardar</Button>

                </div>
            </>
        )
    }

    const RenderListCategories = () => {
        return (
            <>
                <TableCategories/>
            </>
        )
    }

    const Items = [
        {
            key: "1",
            label: "Agregar una categoria",
            children: RenderUploadCategories()
        }, {
            key: "2",
            label: "Administrar Categorias",
            children: RenderListCategories()
        }
    ]
    return (
        <>
            <Collapse accordion items={Items} />
        </>
    )
}

export default ManageCategories;