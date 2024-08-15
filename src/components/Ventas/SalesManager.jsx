import React, { useState } from 'react'
import { Button, Flex, Table, Input } from 'antd'
import { useAppContext } from '../../utils/contexto'
import { AddShoppingCartTwoTone, ShoppingCart } from '@mui/icons-material'
import { render } from '@testing-library/react'
const {Search} = Input
function SalesManager() {
    const [searchText, setSearchText] = useState('')
    const { stockForSales } = useAppContext() 
    console.log(stockForSales)
    let data;
    if (stockForSales && stockForSales.length > 0) {
        data = stockForSales
        .sort((a,b) => a.id_producto - b.id_producto)
        .map((product, index)=> ({
           idCategoria: product.id_categoria,
           idProducto: product.id_producto,
           Categoria: product.nombre_categoria,
           Producto: product.nombre_producto,
           Precio: `$${product.precio_unitario} ARS`,
           Stock: product.stock > 1 ? `${product.stock} unidades - packs` : `${product.stock} unidad - pack`

        }))
    }

    const paginationConfig = {
        pageSize: 10,
    };

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [openModalCart, setOpenModalCart] = useState(false)
    const handleAddToCart = (idProd) =>{
        setSelectedProduct(stockForSales.find((prod)=> prod.id_producto === idProd))
        setOpenModalCart(true)
    }

  return (
    <>
    <Flex wrap>
        <Search
        onChange={(e)=> setSearchText(e.target.value)}
        placeholder='Buscar un producto'
        style={{margin: "1rem",maxWidth:"35%"}}
        size='large'
    />
    <Button style={{marginTop:"1rem"}} size='large'>Revisar <ShoppingCart/></Button>
    </Flex>
        <Flex vertical gap="small">
            <Table dataSource={data} pagination={paginationConfig} scroll={{x: 500}}>
                <Table.Column
                    title="Producto"
                    dataIndex="Producto"
                />
                <Table.Column
                    title="Precio"
                    dataIndex="Precio"
                />
                <Table.Column
                    title="Categoria"
                    dataIndex="Categoria"
                />
                <Table.Column
                    title="Stock disponible"
                    dataIndex="Stock"
                />

                <Table.Column
                    title=""
                    render={(_,record)=>(
                        <Button type='primary' title='Añadir al carrito' onClick={() => handleAddToCart(record.idProducto)}><AddShoppingCartTwoTone/></Button>
                    )}
                />
            </Table>
        </Flex>
    </>
  )
}

export default SalesManager