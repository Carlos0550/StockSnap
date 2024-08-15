import { TextField } from '@mui/material'
import { Button, message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../../utils/contexto'

function EditCategories({closeModal,selectedCategory}) {
    const keys = Object.keys(selectedCategory)
    const { updateCategory } = useAppContext()
    const [newValues, setNewValues] = useState({
        id_categoria: selectedCategory.id_categoria,
        nombre_categoria: selectedCategory.nombre_categoria || "",
        descripcion: selectedCategory.descripcion || "",
    })
    const handleInput = (e) =>{
        const {name, value} = e.target
        setNewValues(prevValue => ({
            ...prevValue,
            [name]: value,
        }))
    }

    // useEffect(()=>{
    //     console.log(newValues)
    // },[newValues])
    const [isUpdating, setIsUpdating] = useState(false)
    const handleSubmit = async(e)=>{
        e.preventDefault()
        if ((newValues.nombre_categoria).trim() === "" || (newValues.nombre_categoria).trim().length < 3) {
            message.error("El nombre de la categoria esta incompleto o no es válido")
            return;
        }else{
            setIsUpdating(true)
            const hiddenMessage = message.loading("Actualizando...",0)
            await updateCategory(newValues)
            setIsUpdating(false)
            hiddenMessage()
            closeModal()
        }
    }

  return (
    <>
    <Modal
        open={true}
        onCancel={closeModal}
        footer={
            [
            <Button type='primary' onClick={closeModal} danger>Cancelar</Button>
        ]
        }
    >

       {keys
       .filter((key)=> key !== 'categoria_activa' && key !== 'id_categoria')
       .map((key) => (
            <div key={key} style={{padding:"1rem"}}>
                <TextField
                fullWidth
                id={key}
                name={key}
                label={key === "descripcion" ? key.replace("_"," ").toUpperCase().concat(" - Opcional") : key.replace("_"," ").toUpperCase()}
                value={newValues[key]}
                onChange={handleInput}
                />
            </div>
       ))}
        <Button onClick={handleSubmit} disabled={isUpdating}>{isUpdating ? <Spin/> : "Actualizar"}</Button>
    </Modal>
    </>
  )
}

export default EditCategories