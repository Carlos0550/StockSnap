import { Button, Flex, message, Modal } from 'antd'
import React from 'react'
import "./makeSale.css"
import { PagoDinero } from '../../../../utils/SVGs/PagoDinero'
import { CreditCard } from '../../../../utils/SVGs/CreditCard'
import { Transaction } from '../../../../utils/SVGs/Transaction'
import {useAppContext} from "../../../../utils/contexto"
import { cartSum } from '../../processDataSales'
import axios from 'axios'
function MakeSale({closeModal}) {
  const { cart,getFullDate } = useAppContext()
  let total = cartSum(cart)
  const handleMakeSale = async(method) => {
    const hiddenMessage = message.loading("Aguarde...")
    const fecha = getFullDate.format("YYYY-MM-DD")
    try {
      const response = await axios.post("http://localhost:4000/make-sale",{fecha,total, method, cart})
      if (response.status === 200) {
        hiddenMessage()
        message.success("Venta guardada exitosamente!")   
      }else{
        message.error(`${response.data.message}`)
      }
    } catch (error) {
      if (error.response) {
        message.error(`${error.response.data.message}`)
      }else{
        message.error("Error de red: Verifique su conexión e intente nuevamente")
      }
    }finally{
      hiddenMessage()
    }
  }

  return (
    <>
        <Modal
        open={true}
        closeIcon={false}
        footer={[
            <Button onClick={closeModal} type='primary' danger>Cancelar</Button>
        ]}
        title="Seleccione el metodo de pago"
        ><>
        <h3>Total ${total.toLocaleString("es-ES")}</h3>
            <div className='paymentMethods__wrapper'>
                <Button onClick={()=>handleMakeSale("Efectivo")}>Efectivo <PagoDinero/></Button>
                <Button onClick={()=>handleMakeSale("Crédito")}>Crédito <CreditCard/></Button>
                <Button onClick={()=>handleMakeSale("Débito")}>Débito <CreditCard/></Button>
                <Button onClick={()=>handleMakeSale("Transferéncia")}>Transferencia <Transaction/></Button>
            </div>
            </>
        </Modal>
    </>
  )
}

export default MakeSale