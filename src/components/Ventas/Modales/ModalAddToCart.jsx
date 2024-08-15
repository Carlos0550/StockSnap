import { Button, message, Modal, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Flex, InputNumber } from 'antd';
import { useAppContext } from '../../../utils/contexto';
import { AddShoppingCartSharp } from '@mui/icons-material';
const { Meta } = Card
function ModalAddToCart({ closeModal, selectedProduct }) {
    const [quantityValue, setQuantityValue] = useState(1)
    const { setCart, cart } = useAppContext()
    const onChange = (value) => {
        setQuantityValue(value);

    };

   const handleAddToCart = () =>{
        const prevCart = [...cart]
        const id_itemToAdd = selectedProduct.id_producto
        const existingItem = prevCart.find(item => item.id_producto === id_itemToAdd);

       if (existingItem) {
            existingItem.quantity = quantityValue
       }else{
        prevCart.push({
            ...selectedProduct,
            quantity: quantityValue
        })
       }

       setCart(prevCart)
       message.success(`${selectedProduct.nombre_producto} añadido!`)
       closeModal()
   }


    // useEffect(()=>{
    //     console.log("Carrito serializado ", JSON.stringify(cart))
    // },[cart])
    return (
        <>
            <Modal
                open={true}
                onCancel={closeModal}
                footer={[
                    <Button type='primary' danger onClick={closeModal}>Cerrar</Button>
                ]}
            >
                <Flex vertical>
                    <Card hoverable style={{ margin: "1rem" }}>
                        <Meta title={selectedProduct.nombre_producto} description={(
                            <>
                                <Tag
                                    color={quantityValue > selectedProduct.stock ? 'red' : 'green'}
                                    style={{ fontSize: "1rem", marginTop: "1rem", marginBottom: "1rem" }}
                                >
                                    {quantityValue > selectedProduct.stock ? "La cantidad supera el stock disponible" : (
                                            <>
                                                Ingrese una cantidad no mayor a: <br/>
                                                <strong>{selectedProduct.stock}</strong>
                                            </>
                                        )}
                                </Tag>  
                                <Flex gap="small">
                                <Col span={12}>
                                    <InputNumber
                                        min={1}
                                        value={quantityValue}
                                        onChange={onChange}
                                        style={{ width: '100%' }}
                                        status={quantityValue > selectedProduct.stock ? "error" : ""}
                                    />
                                </Col>
                                <Button type='primary' onClick={handleAddToCart}>Añadir al carrito <AddShoppingCartSharp/></Button>
                                </Flex>
                            </>
                        )} />

                    </Card>




                </Flex>
            </Modal>
        </>
    )
}

export default ModalAddToCart