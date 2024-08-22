import React, { useState } from 'react';
import { Button, Flex, Table, Input, message, Select } from 'antd';
import { useAppContext } from '../../utils/contexto';
import { AddShoppingCartTwoTone, ShoppingCart } from '@mui/icons-material';
import ModalAddToCart from './Modales/ModalAddToCart';
import ViewCart from './Modales/ViewCart';

const { Search } = Input;
const { Option } = Select
function SalesManager() {
    const [searchText, setSearchText] = useState('');
    const { stockForSales, setStockForSales, categories, proveedores } = useAppContext();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openModalCart, setOpenModalCart] = useState(false);
    const [openViewCart, setOpenViewCart] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);

    if (!stockForSales) {
        message.warning('No hay productos disponibles.');
        return null;
    }

    const filteredData = stockForSales
    .filter(prod => {
        // Filtrar por nombre de producto
        const matchesSearchText = prod.nombre_producto.toLowerCase().includes(searchText.toLowerCase());

        // Filtrar por categoría si está seleccionada
        const matchesCategory = selectedCategory ? prod.id_categoria === selectedCategory : true;

        // Filtrar por proveedor si está seleccionado
        const matchesProvider = selectedProvider ? prod.id_proveedor === selectedProvider : true;

        return matchesSearchText && matchesCategory && matchesProvider;
    })
        .sort((a, b) => a.id_producto - b.id_producto)
        .map(product => ({
            idCategoria: product.id_categoria,
            idProducto: product.id_producto,
            Categoria: product.nombre_categoria === "sin_categoria" ? "Sin categoria" : product.nombre_categoria === "categoria_eliminada" ? "Categoria eliminada" : product.nombre_categoria,
            Producto: product.nombre_producto,
            Precio: product.precio_unitario.toLocaleString("es-ES", { style: "currency", currency: "ARS" }),
            Stock: product.stock > 1 ? `${product.stock} unidades - packs` : `${product.stock} unidad - pack`,
        }));

    const paginationConfig = {
        pageSize: 10,
    };

    const handleViewCart = () => {
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

    const updateStockInGlobalState = (idProducto, newStock) => {
        const updatedStock = stockForSales.map(prod => {
            if (prod.id_producto === idProducto) {
                return { ...prod, stock: newStock }
            }
            return prod
        });
        setStockForSales(updatedStock)
    }

    return (
        <>
            <Search
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder='Buscar un producto'
                    style={{ margin: "1rem", maxWidth: "35%" }}
                    size='large'
                />
            <Flex gap="middle">
                    

                    Filtrar por categoría
                    <Select
                        style={{ width: "200px" }}
                        onChange={(value) => setSelectedCategory(value)}
                        placeholder="Seleccionar categoría"
                    >
                        <Option value={null}>Todas las categorias</Option>
                        {categories.map((cat) => (
                            <Option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre_categoria === "categoria_eliminada" ? "Categorias desvinculados/eliminados" : cat.nombre_categoria}
                            </Option>
                        ))}
                    </Select>
                </Flex>
                <Button onClick={handleViewCart} style={{ marginTop: "1rem" }} size='large'>
                    Revisar <ShoppingCart />
                </Button>
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
            {openModalCart && <ModalAddToCart closeModal={() => setOpenModalCart(false)} selectedProduct={selectedProduct} updateStockInGlobalState={updateStockInGlobalState} />}
            {openViewCart && <ViewCart closeModal={handleViewCart} />}
        </>
    );
}

export default SalesManager;
