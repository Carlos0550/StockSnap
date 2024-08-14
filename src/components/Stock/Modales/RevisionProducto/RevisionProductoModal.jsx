import { Button, Modal,Flex, Divider } from 'antd'
import { TextField } from '@mui/material'

import React, { useState } from 'react'
import { useAppContext } from '../../../../utils/contexto'

function RevisionProductoModal({ closeModal, product, capitalizeLabel, proveedores, categorias, setter, setterCategorias, setterProveedores }) {
    const keys = Object.keys(product)
    console.log(product)
    const { insertProducts } = useAppContext()

    const getCategoryNameById = (id) => {

        const category = categorias.find(cat => cat.id_categoria === id)
        return category ? category.nombre_categoria : "Desconocido"
    }

    const getProviderNameById = (id) => {
        console.log(id)
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
            <Flex gap="small">
            <TextField
                id={product.id_producto}
                label="Nombre del producto"
                variant="standard"
                value={product.nombre_producto}
                fullWidth
                multiline
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <TextField
                id={product.id_producto}
                label="Precio unitario"
                variant="standard"
                value={product.precio_unitario}
                fullWidth
                multiline
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            </Flex>
            <Flex gap="middle" wrap>
            <TextField
                id={product.id_producto}
                label="Stock disponible"
                variant="standard"
                value={(product.stock).concat("\n Unidades/packs")}
                fullWidth
                
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <TextField
                id={product.id_producto}
                label="Proveedor insertado"
                variant="standard"
                value={getProviderNameById(product.proveedor)}
                fullWidth
                multiline
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <TextField
                id={product.id_producto}
                label="Categoria seleccionada"
                variant="standard"
                value={getCategoryNameById(product.categoria)}
                fullWidth
                multiline
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            </Flex>
            <Flex>
            
            </Flex>
        </Modal>
    );
}

export default RevisionProductoModal