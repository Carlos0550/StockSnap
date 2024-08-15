import React from 'react';
import { Modal, Button, Card, Row, Col, Flex } from 'antd';
import { AddCardOutlined, CleaningServices, Money, MoneyOffRounded, MoneyOutlined, MoneyRounded, MoneySharp, ShoppingBagOutlined, Shower, StopCircle } from '@mui/icons-material';
import { useAppContext } from '../../../utils/contexto';
import "./Css/ViewCart.css"
const { Meta } = Card;

function ViewCart({ closeModal }) {
  const { cart,completeCashSale } = useAppContext();

  // Agrupa los productos de dos en dos
  const chunkedCart = [];
  for (let i = 0; i < cart.length; i += 2) {
    chunkedCart.push(cart.slice(i, i + 2));
  }
  let sumatoriaPrecio = cart.reduce((acc, product)=>  acc + (product.precio_unitario * product.quantity) ,0)

  return (
    <>
      <Modal
        open={true}
        onCancel={closeModal}
        footer={[
          <Button type='primary' onClick={closeModal} danger>Volver</Button>
        ]}
      >
        <Flex vertical gap="small" onScroll={{y: 500}}>
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
                    <h1>Total: {sumatoriaPrecio}</h1>
                )}
                description={(
                    <>
                    <Flex gap="small" vertical>
                    <Button type='primary' danger>Limpiar carrito <CleaningServices/></Button>
                    <Button type='primary' onClick={completeCashSale}>Concretar venta en efectivo <MoneyRounded/></Button>
                    <Button type='primary'>Concretar venta Mercado Pago <AddCardOutlined/></Button>
                    </Flex>

                    </>
                )}
                >
                </Meta>
        </Card>
        </Flex>
      </Modal>
    </>
  );
}

export default ViewCart;
