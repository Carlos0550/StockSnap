import { TextField } from '@mui/material'
import { Button, message, Modal, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../../../utils/contexto'
const {Option} = Select
function EditStockModal({closeModal,selectedStock}) {
    const [errors, setErrors] = useState({
        id_producto: "",
        proveedor: "",
        id_proveedor: "",
        categoria: "",
        id_categoria: "",
        nombre_producto: "",
        precio: "",
        stock: ""
    })
    const {proveedores, categories,updateProduct} = useAppContext()
    const filteredProviders = proveedores.filter((prov) => prov.nombre_proveedor !== "proveedor_eliminado" && prov.proveedor_activo === true)
    const [values, setValues] = useState({
        id_producto: selectedStock.id_producto,
        proveedor: selectedStock.nombre_proveedor === "proveedor_eliminado" && selectedStock.proveedor_activo === true ? "" : selectedStock.nombre_proveedor,
        id_proveedor: selectedStock.id_proveedor,
        categoria: selectedStock.nombre_categoria,
        id_categoria: selectedStock.id_categoria,
        nombre_producto: selectedStock.nombre_producto,
        precio: selectedStock.precio_unitario,
        stock: selectedStock.stock
    })

    console.log(values.categoria)
    const filteredCategories = categories.filter(cat => cat.categoria_activa === true)

    const handleChange = (key, value) => {
        setValues(prevValues => ({
            ...prevValues,
            [key]: value
        }));
    };

    const handleSelectChange = (key, value, nameKey,name) =>{
        
        setValues(prevValues =>({
            ...prevValues,
            [key]:value,
            [nameKey]: name
        }))
    } 
    // // const alreadyShow = useRef(false)
    // useEffect(()=>{
    //     // if(alreadyShow.current) return
    //     console.log("Valores del antiguo producto: ", selectedStock)
    //     console.log("Valores de los inputs(values): ", values)
    //     // alreadyShow.current = true
    // },[values])
    const [isUpdating, setIsUpdating] = useState(false)
    const handleSubmit = async(e) =>{
        e.preventDefault()
        const newError = {};
        let hasError = false;

        Object.keys(values).forEach(key=>{
            if (typeof values[key] === "string") {
                if(values[key].trim() === ""){
                    newError[key] = "Este campo es obligatorio"
                    hasError= true;
                }
            }else if(typeof values[key] === "number"){
                if (isNaN(values[key]) || values[key] <= 0) {
                    newError[key] = "Este campo es obligatorio";
                    hasError = true;
                }
            }else {
                newError[key] = "Valor inválido";
                hasError = true;
            }
        });

        const stockValue = parseFloat(values.stock)
        if (isNaN(stockValue) || stockValue <= 0) {
            newError.stock = "El stock debe ser un número mayor a 0";
            hasError = true;
        }
        setErrors(newError)
        if (!hasError) {
           setIsUpdating(true)
           await updateProduct(values)
           setIsUpdating(false)
           closeModal()
        }
    }   
  return (
    <>
    <Modal
    title= "Editar producto"
    open={true}
    onCancel={closeModal}
    footer={[
        <Button type='primary' danger onClick={closeModal} disabled={isUpdating}>Cancelar</Button>,
        <Button type='outlined' style={{backgroundColor: isUpdating ? "#ccc" : "green", color: "white"}} disabled={isUpdating} onClick={handleSubmit}>Actualizar</Button>
    ]}
    >
       <div className="flex-cont">
                <TextField
                    label="Nombre del producto"
                    id="nombre_producto"
                    variant="standard"
                    value={values.nombre_producto}
                    onChange={(e) => handleChange('nombre_producto', e.target.value)}
                    fullWidth
                    error={!!errors.nombre_producto}
                    helperText={errors.nombre_producto}
                    margin="normal"
                />
                <TextField
                    label="Precio unitario"
                    id="precio_unitario"
                    variant="standard"
                    value={values.precio}
                    onChange={(e) => handleChange('precio', e.target.value)}
                    fullWidth
                    error={!!errors.precio}
                    helperText={errors.precio}
                    margin="normal"
                />
            </div>

            <div className="flex-cont">
                <TextField
                    label="Stock disponible"
                    id="stock"
                    variant="standard"
                    value={values.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    fullWidth
                    error={!!errors.stock}
                    helperText={errors.stock}
                    margin="normal"
                />
            </div>

            <div className="flex-cont">
                <Select
                    id="id_categoria"
                    value={values.categoria}
                    onChange={(value,option) => handleSelectChange('id_categoria', value, "categoria", option.children)}
                    placeholder="Selecciona una categoría"
                    style={{ width: "100%", marginBottom: "1rem" }}
                >
                     {filteredCategories.map((category) => (
                            <Option key={category.id_categoria} value={category.id_categoria}>
                                {category.nombre_categoria}
                            </Option>
                        ))}
                </Select>
                <Select
                    id="id_proveedor"
                    value={values.proveedor}
                    onChange={(value, option) => handleSelectChange('id_proveedor', value, 'proveedor', option.children)}
                    placeholder="Selecciona un proveedor"
                    
                    style={{ width: "100%" }}
                >
                    {filteredProviders.map((proveedor) => (
                            <Option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                {proveedor.nombre_proveedor}
                            </Option>
                        ))}
                </Select>
            </div>

    </Modal>
    </>
  )
}

export default EditStockModal