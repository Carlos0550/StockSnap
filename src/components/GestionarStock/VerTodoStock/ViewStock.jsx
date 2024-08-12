import React, { useState } from 'react'
import { useAppContext } from '../../../utils/contexto'
import { Button, Table, Input, Flex } from 'antd';
import { DeleteOutline, Draw } from '@mui/icons-material';
import EditStockModal from '../Modales/EditarStock/EditStockModal';
const {Search} = Input
function ViewStock() {
  const { products,deleteProduct } = useAppContext()
  const [EditModalState, setEditModalState] = useState(false)
  const [selectedStock, setSelectedStock] = useState([])

  const toggleModalEdit = (key) =>{
    setSelectedStock(products[key])
    setEditModalState(!EditModalState)
  }
  const [idDeleting, setIsDeleting] = useState(false)
  const handleDeleteProduct = async(id) =>{
      setIsDeleting(true)
      await deleteProduct(id)
      setIsDeleting(false)
  }

  const formatProviderText = (text) =>{
    const formatText = text.split("_").map((word)=>{
      return word.charAt(0).toUpperCase() + word.slice(1)
    })

    return formatText.join(" ")
  }
  let data;

  if (products && products.length > 0) {
    data = products
      .slice()
      .sort((a, b) => a.id_producto - b.id_producto)
      .map((product, index) => ({
        key: index.toString(),
        id_producto: product.id_producto,
        proveedor: formatProviderText(product.nombre_proveedor),
        categoria: product.nombre_categoria,
        nombre_producto: product.nombre_producto,
        precio: `$${product.precio_unitario}`,
        stock: product.stock
      }))
  }

  const paginationConfig = {
    pageSize: 15
  }
  
  
  return (
    <>

      <div className="tableStock__container">
      <Table dataSource={data} pagination={paginationConfig}>
        
        <Table.Column
          title="Nombre producto"
          dataIndex="nombre_producto"
          key="nombre_producto"
        />
        
        <Table.Column
          title="Stock disponible"
          dataIndex="stock"
          key="stock"
        />

        <Table.Column
        title="Precio unitario"
        dataIndex="precio"
        key="precio"
        />

        <Table.Column
        title="Categoria"
        dataIndex="categoria"
        key="categoria"
        />

        <Table.Column
        title="Proveedor"
        dataIndex="proveedor"
        key="proveedor"
        />

        <Table.Column
          title=""
          key="accion"
          render={(_, record)=>(
           <Flex gap="middle" wrap justify='center' align='center'>
            <Button type='primary' danger disabled={idDeleting} onClick={()=> handleDeleteProduct(record.id_producto)}><DeleteOutline/></Button>
            <Button onClick={()=>toggleModalEdit(record.key)} disabled={idDeleting}><Draw/></Button>
           </Flex>
            
          )}
        />
      </Table>
      </div>

      {EditModalState && <EditStockModal closeModal={()=> toggleModalEdit()} selectedStock={selectedStock}/>}
    </>
  )
}

export default ViewStock