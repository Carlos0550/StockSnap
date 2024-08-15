import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Flex, message, Result } from 'antd';
import { AddCardOutlined, CleaningServices, DoneAll, MoneyRounded, Print} from '@mui/icons-material';
import { useAppContext } from '../../../utils/contexto';
import "./Css/ViewCart.css"
import ResultSuccess from '../Resultados/ResultSuccess';
const { Meta } = Card;

function ViewCart({ closeModal }) {
  const { cart,completeCashSale } = useAppContext();

  // Agrupa los productos de dos en dos
  const chunkedCart = [];
  for (let i = 0; i < cart.length; i += 2) {
    chunkedCart.push(cart.slice(i, i + 2));
  }
  let sumatoriaPrecio = cart.reduce((acc, product)=>  acc + (product.precio_unitario * product.quantity) ,0)

  const [processingPurchase, setProcessingPurchase] = useState(false)
  const [purchaseFailed, setPurchaseFailed] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const handleFinnalyPurchaseCash = async() =>{
    setProcessingPurchase(true)
    const response = await completeCashSale()
    setProcessingPurchase(false)


    if (response.code === 201) {
        message.success("Compra en efectivo concretada con éxito")
        closeModal()
        setPurchaseSuccess(true)

    }else{
      message.error("Hubo un error al procesar la compra, por favor intente nuevamente",4)
      setPurchaseFailed(true)

    }
  }

  console.log(purchaseSuccess)
  return (
    <>
      <Modal
        open={true}
        onCancel={closeModal}
        footer={[
          <Button type='primary' onClick={closeModal} danger>Volver</Button>
        ]}
      >
        <Flex vertical gap="small" >
        <div className="products__cart-container">
        {chunkedCart.map((pair, index) => (
          <Row gutter={[16, 16]} key={index} justify="center">
            {pair.map((product, idx) => (
              <Col span={12} key={idx}>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                >
                  <Meta 
                    title={product.nombre_producto} 
                    description={`Cantidad: ${product.quantity} - Precio: $${product.precio_unitario}`} 
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ))}
        </div>

        <Card hoverable style={{width:"100%"}}>
                <Meta 
                title={(
                    <h1>Total: ${sumatoriaPrecio}</h1>
                )}
                description={(
                    <>
                    <Flex gap="small" vertical>
                    <Button type='primary' danger disabled={processingPurchase}>Limpiar carrito <CleaningServices/></Button>
                    <Button type='primary' onClick={handleFinnalyPurchaseCash} disabled={processingPurchase}>Concretar venta en efectivo <MoneyRounded/></Button>
                    <Button type='primary' disabled={processingPurchase}>Concretar venta Mercado Pago <AddCardOutlined/></Button>
                    </Flex>

                    </>
                )}
                >
                </Meta>
        </Card>
        </Flex>
      </Modal>

      {purchaseSuccess && (
        <ResultSuccess/>
      )}
    </>
  );
}

export default ViewCart;
