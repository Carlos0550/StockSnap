import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import { Card, Col, Row, Flex, InputNumber } from 'antd';
import { TextField } from '@mui/material';

function ModalAddToCart({ closeModal, selectedProduct }) {
    const [quantityValue, setQuantityValue] = useState(1)
    console.log(quantityValue)
    const onChange = (value) => {
        setQuantityValue(value);

    };
    return (
        <>
            <Modal
                open={true}
                onCancel={closeModal}
                footer={[
                    <Button type='primary' danger onClick={closeModal}>Cerrar</Button>
                ]}
            >
                <Flex>
                    <TextField
                        id={selectedProduct.id_producto}
                        value={selectedProduct.nombre_producto}
                        label="Nombre del producto"
                        size='small'
                        InputProps={{ readOnly: true }}
                    />

                    <Col span={12}>
                        <InputNumber
                            min={1}
                            value={quantityValue}
                            onChange={onChange}
                            style={{ width: '100%' }}
                            status={quantityValue > selectedProduct.stock ? "error" : ""}
                        />
                    </Col>
                </Flex>
            </Modal>
        </>
    )
}

export default ModalAddToCart