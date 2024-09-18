import { Button, Flex, Form, Input, message, Modal, Result, Select } from 'antd'
import React, { useState } from 'react'
import "./makeSale.css"
import { PagoDinero } from '../../../../utils/SVGs/PagoDinero'
import { CreditCard } from '../../../../utils/SVGs/CreditCard'
import { Transaction } from '../../../../utils/SVGs/Transaction'
import {useAppContext} from "../../../../utils/contexto"
import { cartSum } from '../../../../utils/processDataSales'
import axios from 'axios'
import { config } from '../../../../config'
const { Option } = Select
function MakeSale({closeModal}) {
  const { cart,getFullDate, setCart, fetchAllResources } = useAppContext()
  const [showSuccess, setShowSuccess] = useState(false) 
  const [idVenta, setIdVenta] = useState(null) 
  const [form] = Form.useForm()
  const [description,setDescription] = useState({
    cuotas: "",
    datos_adicionales: ""
  })
  const [expandDescription, setExpandDescription] = useState(false)

  

  let total = cartSum(cart)
  const handleMakeSale = async(method, adicionalData = []) => {
    let serializedAdicionalData = ''
    if (adicionalData) {
      serializedAdicionalData = JSON.stringify(adicionalData)
    }else{
      return []
    }
    const hiddenMessage = message.loading("Aguarde...")
    
    const fecha = getFullDate.format("YYYY-MM-DD")
    try {
      const response = await axios.post(`${config.apiBaseUrl}/make-sale`,{fecha,total, method, cart, serializedAdicionalData})
      setIdVenta(response.data.id_venta)
      if (response.status === 200) {
        hiddenMessage()
        message.success("Venta guardada exitosamente!")   
        setShowSuccess(true)
        setCart([])
        fetchAllResources()
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


  const handleCreditOptions = (method) => {
    if (method.trim() === "Crédito") {
      setExpandDescription(!expandDescription)
    }
  }

  const renderFormCreditOptions = () => (
    <>
      <Form
      form={form}
      name='adicional_data_credit'
      onFinish={(values)=>handleMakeSale("Crédito", values)}
      >
        <Form.Item
        name="cuotas"
        label= "Seleccione las cuotas"
        rules={[
          {required: true, message: "Seleccione las cuotas"}
        ]}
        >
          <Select
          placeholder= "Seleccione las cuotas"
          style={{width: "100%"}}
          allowClear
          >
            <Option value="1">1</Option>
            <Option value="3">3</Option>
            <Option value="6">6</Option>
            <Option value="9">9</Option>
            <Option value="12">12</Option>
          </Select>
        </Form.Item>

        <Form.Item
        name={"descripcion_adicional"}
        style={{width: "100%"}}
        label="Datos adicionales"
        >
          <Input.TextArea rows={4} aria-expanded={false} autoSize={false} style={{ resize: 'none' }}/>
        </Form.Item>
        <Form.Item>
          <Button style={{backgroundColor: "green", color: "white"}} htmlType='submit'>Concretar Venta</Button>
        </Form.Item>
      </Form>
    </>
  )


  return (
    <>
        <Modal
        open={true}
        closeIcon={false}
        footer={[
            showSuccess ? "" : <Button onClick={closeModal} type='primary' danger >Cancelar</Button>
        ]}
        title={!showSuccess && "Seleccione el metodo de pago"}
        >
            {!showSuccess && <>
            <h3>Total ${total.toLocaleString("es-ES")}</h3>
            <div className='paymentMethods__wrapper'>
                <Button onClick={()=>handleMakeSale("Efectivo")}>Efectivo <PagoDinero/></Button>
                <Button onClick={()=>handleCreditOptions("Crédito")} danger={expandDescription}>{expandDescription ? "Cancelar" : "Crédito"} <CreditCard/></Button>
                <Button onClick={()=>handleMakeSale("Débito")}>Débito <CreditCard/></Button>
                <Button onClick={()=>handleMakeSale("Transferéncia")}>Transferencia <Transaction/></Button>
                {expandDescription && renderFormCreditOptions()}
            </div>
            </>}
            {showSuccess && <Result
            status={'success'}
            title="Venta realizada correctamente!"
            subTitle={
              <>
                <strong>ID de venta: {idVenta}</strong> <br />
                <strong>Encontrará esta venta en su historial de ventas!</strong> 
              </>
            }
            extra={[
              <Button type='primary' danger onClick={()=> closeModal()}>Cerrar</Button>
            ]}
            />}
        </Modal>
    </>
  )
}

export default MakeSale