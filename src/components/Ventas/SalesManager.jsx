import React, { useState } from 'react';
import { Button, Flex, Table, Input, message } from 'antd';
import { useAppContext } from '../../utils/contexto';
import { AddShoppingCartTwoTone, ShoppingCart } from '@mui/icons-material';
import ModalAddToCart from './Modales/ModalAddToCart';
import ViewCart from './Modales/ViewCart';

const { Search } = Input;

function SalesManager() {
    const [searchText, setSearchText] = useState('');
    const { stockForSales } = useAppContext();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openModalCart, setOpenModalCart] = useState(false);
    const [openViewCart, setOpenViewCart] = useState(false)
    if (!stockForSales) {
        message.warning('No hay productos disponibles.');
        return null;
    }

    const filteredData = stockForSales
        .filter(prod => prod.nombre_producto.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => a.id_producto - b.id_producto)
        .map(product => ({
            idCategoria: product.id_categoria,
            idProducto: product.id_producto,
            Categoria: product.nombre_categoria,
            Producto: product.nombre_producto,
            Precio: `$${product.precio_unitario} ARS`,
            Stock: product.stock > 1 ? `${product.stock} unidades - packs` : `${product.stock} unidad - pack`,
        }));

    const paginationConfig = {
        pageSize: 10,
    };

    const handleViewCart = () =>{
        setOpenViewCart(!openViewCart)
    }

    const handleAddToCart = (idProd) => {
        const product = stockForSales.find(prod => prod.id_producto === idProd);
        if (product) {
            setSelectedProduct(product);
            setOpenModalCart(true);
        } else {
            message.error('Producto no encontrado.');
        }
    };

    return (
        <>
            <Flex wrap>
                <Search
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder='Buscar un producto'
                    style={{ margin: "1rem", maxWidth: "35%" }}
                    size='large'
                />
                <Button onClick={handleViewCart} style={{ marginTop: "1rem" }} size='large'>
                    Revisar <ShoppingCart />
                </Button>
            </Flex>
            <Flex vertical gap="small">
                <Table
                    dataSource={filteredData}
                    pagination={paginationConfig}
                    scroll={{ x: 500 }}
                    rowKey="idProducto"
                >
                    <Table.Column
                        title="Producto"
                        dataIndex="Producto"
                    />
                    <Table.Column
                        title="Precio"
                        dataIndex="Precio"
                    />
                    <Table.Column
                        title="Categoría"
                        dataIndex="Categoria"
                    />
                    <Table.Column
                        title="Stock disponible"
                        dataIndex="Stock"
                    />
                    <Table.Column
                        title=""
                        render={(_, record) => (
                            <Button
                                type='primary'
                                title='Añadir al carrito'
                                onClick={() => handleAddToCart(record.idProducto)}
                            >
                                <AddShoppingCartTwoTone />
                            </Button>
                        )}
                    />
                </Table>
            </Flex>
            {openModalCart && <ModalAddToCart closeModal={() => setOpenModalCart(false)} selectedProduct={selectedProduct} />}
            {openViewCart && <ViewCart closeModal={handleViewCart}/>}
        </>
    );
}

export default SalesManager;
