import { Button, message, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Card, Col, InputNumber } from 'antd';
import { useAppContext } from '../../../utils/contexto';
import { AddShoppingCartSharp } from '@mui/icons-material';
const { Meta } = Card;

function ModalAddToCart({ closeModal, selectedProduct, updateStockInGlobalState }) {
    const [quantityValue, setQuantityValue] = useState(1);
    const { setCart, cart } = useAppContext();
    const [errorStock, setErrorStock] = useState(false);
    const onChange = (value) => {
        setQuantityValue(value);
    };

    useEffect(() => {
        setErrorStock(quantityValue > selectedProduct.stock);
    }, [quantityValue, selectedProduct.stock]);

    const handleAddToCart = () => {
        if (errorStock) {
            message.error("La cantidad seleccionada es mayor al del stock", 3);
            return;
        }
        
        const prevCart = [...cart];
        const existingItem = prevCart.find(item => item.id_producto === selectedProduct.id_producto);
        // const newStock = selectedProduct.stock - quantityValue;

        if (existingItem) {
            existingItem.quantity = quantityValue;
            // existingItem.stock = newStock;
        } else {
            prevCart.push({
                ...selectedProduct,
                quantity: quantityValue,
                // stock: newStock
            });
        }

        setCart(prevCart);
        // updateStockInGlobalState(selectedProduct.id_producto, newStock);
        message.success(`${selectedProduct.nombre_producto} añadido!`);
        closeModal();
    };

    return (
        <>
            <Modal
                open={true}
                onCancel={closeModal}
                footer={[
                    <Button key="close" type="primary" danger onClick={closeModal}>
                        Cerrar
                    </Button>
                ]}
            >
                <Card hoverable style={{ margin: "1rem" }}>
                    <Meta
                        title={selectedProduct.nombre_producto}
                        description={(
                            <>
                                <Tag
                                    color={errorStock ? 'red' : 'green'}
                                    style={{ fontSize: "1rem", marginTop: "1rem", marginBottom: "1rem" }}
                                >
                                    {errorStock
                                        ? `La cantidad supera el stock disponible: ${selectedProduct.stock}`
                                        : `Stock disponible: ${selectedProduct.stock}`
                                    }
                                </Tag>
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                    <Col span={12}>
                                        <InputNumber
                                            min={1}
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                            value={quantityValue}
                                            status={errorStock ? 'error' : ''}
                                        />
                                    </Col>
                                    <Button
                                        type='primary'
                                        onClick={handleAddToCart}
                                        disabled={errorStock}
                                    >
                                        Añadir al carrito <AddShoppingCartSharp />
                                    </Button>
                                </div>
                            </>
                        )}
                    />
                </Card>
            </Modal>
        </>
    );
}

export default ModalAddToCart;
