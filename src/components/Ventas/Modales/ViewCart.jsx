import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Flex, Spin } from 'antd';
import { AddCardOutlined, AppRegistrationRounded, CleaningServices, DeleteOutline, Draw, MoneyRounded, Tablet } from '@mui/icons-material';
import { useAppContext } from '../../../utils/contexto';
import "./Css/ViewCart.css"
import ManageClients from '../../masopciones/AdministrarClientes/AdministrarClientes/ManageClients';
const { Meta } = Card;

function ViewCart({ closeModal }) {
  const { cart, completeCashSale, updateStockInDb,setCart } = useAppContext();
  const [openSectionCreateClient, setOpenSectionCreateClient] = useState(false)
  const [OpenSectionShowAllClients, setOpenSectionShowAllClients] = useState(false)

  const updateProductsBeforeShop = async () => {
    await updateStockInDb(cart)
  }
  // Agrupa los productos de dos en dos
  const chunkedCart = [];
  for (let i = 0; i < cart.length; i += 2) {
    chunkedCart.push(cart.slice(i, i + 2));
  }

  let sumatoriaPrecio = cart.reduce((acc, product) => acc + (product.precio_unitario * product.quantity), 0)

  const [processingPurchase, setProcessingPurchase] = useState(false)

  const handleFinnalyPurchase = async (type) => {
    setProcessingPurchase(true)
    if (type === "efectivo") {
      const response = await completeCashSale("efectivo",sumatoriaPrecio)
      setProcessingPurchase(false)

      if (response.code === 201) {
        await updateProductsBeforeShop()
        closeModal()
      }
    } else if (type === "mp") {
      const response = await completeCashSale("mercadopago/transferencia",sumatoriaPrecio)
      setProcessingPurchase(false)
      if (response.code === 201) {
        await updateProductsBeforeShop()
        closeModal()
      }
    }
  }

  const handleDeleteProduct = (idProd) =>{
      setCart(cart.filter((prod)=> prod.id_producto !== idProd))      
  }

  
  const toggleShowClients = () =>{
    setOpenSectionShowAllClients(!OpenSectionShowAllClients)
  }

  
  return (
    <>
      <Modal
        open={true}
        onCancel={closeModal}
        width={1200}
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
                        description={(
                          <>
                          <Flex>
                          Cantidad {product.quantity}Uds - Precio: {product.precio_unitario.toLocaleString("es-ES", { style: "currency", currency: "ARS" })}
                          <Button onClick={()=>handleDeleteProduct(product.id_producto)}><DeleteOutline/></Button>
                          </Flex>
                          </>
                        )}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ))}
          </div>

          <Card hoverable style={{ width: "100%" }}>
            <Meta
              title={(
                <h1>Total: ${sumatoriaPrecio.toLocaleString("es-ES", { style: "currency", currency: "ARS" })}</h1>
              )}
              description={(
                <>
                  <Flex gap="small" vertical>
                    <Button type='primary' danger disabled={processingPurchase || sumatoriaPrecio == 0} onClick={()=> setCart([])}>Limpiar carrito <CleaningServices /></Button>
                    <Button type='primary' onClick={() => handleFinnalyPurchase("efectivo")} disabled={processingPurchase || sumatoriaPrecio == 0}>{processingPurchase ? <Spin /> : (<>Concretar venta en efectivo <MoneyRounded /></>)}</Button>
                    <Button type='primary' disabled={processingPurchase || sumatoriaPrecio == 0} onClick={() => handleFinnalyPurchase("mp")}>Concretar venta Mercado Pago/Transferencia <AddCardOutlined /></Button>
                    <Button type='primary' disabled={sumatoriaPrecio == 0} onClick={toggleShowClients} >Anotar a cuenta corriente <AppRegistrationRounded/></Button>
                  </Flex>

                </>
              )}
            >
            </Meta>
          </Card>
        </Flex>
      </Modal>

    {OpenSectionShowAllClients && <ManageClients carrito={cart} totalAdeudado={sumatoriaPrecio} addingDebt={true} closeModal={()=> setOpenSectionShowAllClients(false)}/>}
    </>
  );
}

export default ViewCart;
