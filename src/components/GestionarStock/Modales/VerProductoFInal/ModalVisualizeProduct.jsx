import { Button, Modal } from 'antd'
import { TextField } from '@mui/material'

import React, { useState } from 'react'
import { useAppContext } from '../../../utils/../../utils/contexto'

function ModalVisualizeProduct({ closeModal, product, capitalizeLabel, proveedores, categorias, setter, setterCategorias, setterProveedores }) {
    const keys = Object.keys(product)
    const { insertProducts } = useAppContext()

    const getCategoryNameById = (id) => {

        const category = categorias.find(cat => cat.id_categoria === id)
        return category ? category.nombre_categoria : "Desconocido"
    }

    const getProviderNameById = (id) => {
        const provider = proveedores.find(prov => prov.id_proveedor === id)
        return provider ? provider.nombre_proveedor : "Desconocido"
    }

    const [isSaving, setIsSaving] = useState(false)
    const handleSubmit = async () => {
        setIsSaving(true)
        await insertProducts(product)
        setIsSaving(false)
        setter({
            nombre_producto: "",
            precio_unitario: "",
            stock: "",
            categoria: "",
            proveedor: ""
        })
        setterCategorias(null)
        setterProveedores(null)
        closeModal()

    }
    return (
        <Modal
            title="Verifique que esté todo en orden"
            open={true}
            onCancel={() => closeModal()}
            footer={[
                <Button key="edit" onClick={closeModal} disabled={isSaving}>Editar producto</Button>,
                <Button key="save" style={{ backgroundColor: isSaving ? "grey" : "green", color: "white" }} disabled={isSaving} onClick={handleSubmit}>Guardar Producto</Button>
            ]}
        >
            {keys.map((key, index) => (
                index % 2 === 0 ? (
                    <div className="flex-cont" key={key}>
                        <TextField
                            id={key}
                            label={capitalizeLabel(key)}
                            variant="standard"
                            value={key === 'categoria' ? getCategoryNameById(product[key]) : key === "proveedores" ? getProviderNameById(product[key]) : product[key]}
                            fullWidth
                            multiline
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                        {index + 1 < keys.length && (
                            <TextField
                                id={keys[index + 1]}
                                label={capitalizeLabel(keys[index + 1])}
                                variant="standard"
                                value={keys[index + 1] === "categoria" ? getCategoryNameById(product[keys[index + 1]]) : keys[index + 1] === "proveedor" ? getProviderNameById(product[keys[index + 1]]) : product[keys[index + 1]]}
                                fullWidth
                                multiline
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        )}
                    </div>
                ) : null
            ))}
        </Modal>
    );
}

export default ModalVisualizeProduct