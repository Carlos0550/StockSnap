import React,{ useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../utils/contexto'
import { Button, Card, Empty, Flex, Table, Tabs } from 'antd'
import AddStock from './AñadirStock/AddStock'
import { columnItemsProducts, processProductData } from '../../utils/processProductsData'
import Edit from '../../utils/SVGs/Edit'
import DeleteIcon from '../../utils/SVGs/DeleteIcon'

function StockManager() {
  const { activeTabStock, setActiveTabStock } = useAppContext()
  const { productos, proveedores } = useAppContext()
  const processedProducts = processProductData(productos,proveedores)
  const [selectedProduct, setSelectedProduct] = useState([])
  const [editingProduct, setEditingProduct] = useState(false)
  const handleChangeTab = (key) => {
    setActiveTabStock(key)
  }

 
const handleEditProduct = (ID) => {
  setSelectedProduct(processedProducts.find(p => p.id === ID))
  console.log(selectedProduct)
  setEditingProduct(true)
  setActiveTabStock("2")
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
                <Button type="primary" danger><DeleteIcon/></Button>
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