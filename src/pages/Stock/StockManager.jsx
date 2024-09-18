import React,{ useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../utils/contexto'
import { Button, Card, Empty, Flex, Popconfirm, Table, Tabs } from 'antd'
import AddStock from './AñadirStock/AddStock'
import { columnItemsProducts, processProductData } from '../../utils/processProductsData'
import Edit from '../../utils/SVGs/Edit'
import DeleteIcon from '../../utils/SVGs/DeleteIcon'

function StockManager() {
  const { activeTabStock, setActiveTabStock,deleteStock } = useAppContext()
  const { productos, proveedores } = useAppContext()
  const processedProducts = processProductData(productos,proveedores)
  const [selectedProduct, setSelectedProduct] = useState([])
  const [editingProduct, setEditingProduct] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState(false)
  const handleChangeTab = (key) => {
    setActiveTabStock(key)
  }

 
const handleEditProduct = (ID) => {
  setSelectedProduct(processedProducts.find(p => p.id === ID))
  console.log(selectedProduct)
  setEditingProduct(true)
  setActiveTabStock("2")
} 

const handleDeleteProduct = async(ID) => {
  setDeletingProduct(true)
  await deleteStock(ID)
  setDeletingProduct(false)
} 

const columnItemsProducts = [
    {
        title: "Producto",
        key: "producto",
        dataIndex: "nombre"
    },
    {
        title: "Precio",
        key: "precio",
        render: (_,record) => (
            <p>{record.precio.toLocaleString("es-ES",{style: "currency", currency: "ARS"})}</p>
        )
    },
    {
        title: "Stock",
        key: "stock",
        dataIndex: "stock"
    },
    {
        title: "Descripcion",
        key: "descripcion",
        dataIndex: "descripcion"
    },
    {
        title: "Proveedor",
        key: "proveedor",
        dataIndex: "proveedor"
    },
    {
        title: "",
        key: "actions",
        render: (_,record) => (
            <Flex gap={"middle"}>
                <Button type="primary" onClick={()=> handleEditProduct(record.id)}><Edit/></Button>
                <Popconfirm
                title="¿Está seguro que desea eliminar el producto?"
                cancelText="Cancelar"
                okText="Eliminar"
                okType='danger'
                description="Esta acción no se puede deshacer"
                okButtonProps={[
                  {loading: deletingProduct, type: "primary"}
                  
                ]}
                onConfirm={()=> handleDeleteProduct(record.id)}
                >
                  <Button type="primary" danger><DeleteIcon/></Button>
                </Popconfirm>
            </Flex>
        )
    },
]

const tabItems = [
  {
    key: "1",
    label: "Listar Stock",
    children: <Table dataSource={processedProducts} columns={columnItemsProducts} scroll={{x: 500}}/>
  },
  {
    key: "2",
    label: "Añadir Stock",
    children: <AddStock editing={editingProduct} selectedProduct={selectedProduct}/>
  }
]
  
  return (
    <>
      <div className="StockManager__wrapper">
        <Card
        title= "Administrador de Stock"
        style={{minWidth: "100%"}}
        >
          <Tabs
          activeKey={activeTabStock}
          onChange={handleChangeTab}
          items={tabItems}
          destroyInactiveTabPane
          >

          </Tabs>
        </Card>
      </div>
    </>
  )
}

export default StockManager