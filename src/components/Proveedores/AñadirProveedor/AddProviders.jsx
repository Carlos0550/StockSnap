import { TextField } from '@mui/material';
import { Button, message, Modal, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../utils/contexto';

function AddProviders({editingProvider, selectedProvider,closeModalEditProvider }) {
  // console.log("Editando proveedor: ", editingProvider)
  let parseProvider; 
  if (selectedProvider) {
    try{
      parseProvider = JSON.parse(selectedProvider.contacto)
    }catch(error){
      console.log(error)
    }
  }

  const { addProvider, updateProvider } = useAppContext()
  const [values, setValues] = useState({
    id_proveedor: editingProvider ? selectedProvider ?.id_proveedor : "",
    nombreProveedor: editingProvider ? selectedProvider ?.nombre_proveedor : "",
    contacto: {
      telefono: editingProvider ? parseProvider ?.telefono : "",
      email: editingProvider ? parseProvider ?.email : "",
      ubicacion: editingProvider ? parseProvider ?.ubicacion : ""
    }
  });

  // useEffect(()=>{
  //   console.log(values)
  // },[values])

  const [errors, setErrors] = useState({
    nombreProveedor: "",
    contacto: {
      telefono: "",
      email: "",
      ubicacion: ""
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name in values.contacto) {
      setValues({
        ...values,
        contacto: {
          ...values.contacto,
          [name]: value
        }
      });
    } else {
      setValues({
        ...values,
        [name]: value
      });
    }
  };


  const [addingProvider, setAddingProvider] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    let newErrors = {};

    if (values.nombreProveedor.trim() === "") {
      newErrors.nombreProveedor = "Este campo es obligatorio";
      hasError = true;
    }

    if (values.contacto.telefono.trim() === "") {
      newErrors["contacto.telefono"] = "Este campo es obligatorio";
      hasError = true;
    } else if (isNaN(values.contacto.telefono)) {
      newErrors["contacto.telefono"] = "El teléfono debe ser un número válido";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    message.success("Validaciones completadas")
    setAddingProvider(true)
    if (!editingProvider) {
      await addProvider(values)
    }else{
      await updateProvider(values)
      
    }
    setValues({
      nombreProveedor: "",
      contacto: {
        telefono: "",
        email: "",
        ubicacion: ""
      }
    })
    setAddingProvider(false)

    if(editingProvider) closeModalEditProvider();
  };
  return (
    <>
      <div className="flex-cont" style={{ flexWrap: "wrap" }}>
        <TextField
          name='nombreProveedor'
          fullWidth
          label="Nombre del proveedor"
          value={values.nombreProveedor}
          onChange={handleInputChange}
          error={!!errors.nombreProveedor}
        />
        {Object.keys(values.contacto).map((key, index) => (
          <React.Fragment key={key}>
            {index % 2 === 0 && (
              <div className="flex-cont" style={{ display: 'flex', flexWrap: 'wrap' }}>
                <TextField
                  name={key}
                  fullWidth
                  label={`${key.charAt(0).toUpperCase() + key.slice(1)}:`}
                  value={values.contacto[key]}
                  onChange={handleInputChange}
                  error={!!errors[`contacto.${key}`]}
                  helperText={errors[`contacto.${key}`]}
                />
                {index + 1 < Object.keys(values.contacto).length && (
                  <TextField
                    name={Object.keys(values.contacto)[index + 1]}
                    fullWidth
                    label={`${Object.keys(values.contacto)[index + 1].charAt(0).toUpperCase() + Object.keys(values.contacto)[index + 1].slice(1)}:`}
                    value={values.contacto[Object.keys(values.contacto)[index + 1]]}
                    onChange={handleInputChange}
                    error={!!errors[`contacto.${Object.keys(values.contacto)[index + 1]}`]}
                    helperText={errors[`contacto.${Object.keys(values.contacto)[index + 1]}`]}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <Space style={{ margin: "1rem" }}>
        {!editingProvider && <Button style={{ backgroundColor: addingProvider ? "#ccc" : "green", color: "white", fontSize: "1rem" }}  onClick={handleSubmit} disabled={addingProvider}>{addingProvider ? <Spin/> : "Guardar proveedor"}</Button>}
        {editingProvider && <Button type='primary' disabled={addingProvider} onClick={handleSubmit}>{addingProvider ? <Spin/> : "Actualizar"}</Button>}
      </Space>

    </>
  );
}

export default AddProviders;
