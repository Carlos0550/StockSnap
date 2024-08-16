import { Button, message, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Card, Col, InputNumber } from 'antd';
import { useAppContext } from '../../../utils/contexto';
import { AddShoppingCartSharp } from '@mui/icons-material';
const { Meta } = Card;

function ModalAddToCart({ closeModal, selectedProduct,updateStockInGlobalState }) {
    const [quantityValue, setQuantityValue] = useState(1);
    const { setCart, cart } = useAppContext();

    const onChange = (value) => {
        setQuantityValue(value);
    };

    const handleAddToCart = () => {
        const prevCart = [...cart];
        const id_itemToAdd = selectedProduct.id_producto;
        const existingItem = prevCart.find(item => item.id_producto === id_itemToAdd);

        const actualStock = selectedProduct.stock;

        if (quantityValue > actualStock) {
            message.error("La cantidad seleccionada supera el stock disponible.");
            return;
        }

        if (existingItem) {
            existingItem.quantity += quantityValue;
            existingItem.stock -= quantityValue;
        } else {
            prevCart.push({
                ...selectedProduct,
                quantity: quantityValue,
                stock: actualStock - quantityValue
            });
        }

        setCart(prevCart);

        // Actualizamos el stock en el estado global
        updateStockInGlobalState(selectedProduct.id_producto, actualStock - quantityValue);

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
                                    color={quantityValue > selectedProduct.stock ? 'red' : 'green'}
                                    style={{ fontSize: "1rem", marginTop: "1rem", marginBottom: "1rem" }}
                                >
                                    {quantityValue > selectedProduct.stock
                                        ? "La cantidad supera el stock disponible"
                                        : `Stock disponible: ${selectedProduct.stock}`
                                    }
                                </Tag>
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                    <Col span={12}>
                                        <InputNumber
                                            min={1}
                                            max={selectedProduct.stock}
                                            value={quantityValue}
                                            onChange={onChange}
                                            style={{ width: '100%' }}
                                            status={quantityValue > selectedProduct.stock ? "error" : ""}
                                        />
                                    </Col>
                                    <Button
                                        type='primary'
                                        onClick={handleAddToCart}
                                        disabled={quantityValue > selectedProduct.stock}
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
