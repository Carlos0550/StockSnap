import { Button, Modal, Table } from 'antd'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../../utils/contexto'

function ViewHistoryDelivers({closeModal,parsedDeliveries}) {
    const {widthValue} = useAppContext()

    let data;
    if (parsedDeliveries.length > 0) {
        data = parsedDeliveries
        .map((item, index)=>{

            return{
                index: (index + 1).toString(),
                fechaEntrega: item.fecha_entrega,
                montoEntregado: item.monto
            }
        })
        .sort((a,b)=> new Date(b.fechaEntrega) - new Date(a.fechaEntrega))

    }
    
  return (
    <>
        <Modal
        open={true}
        onCancel={closeModal}
        width={widthValue}
        footer={[
            <Button onClick={closeModal} type='primary' danger>Cerrar</Button>
        ]}
        >
            <Table dataSource={data} scroll={{x:500}}>
                <Table.Column
                title="#"
                dataIndex="index"
                />
                <Table.Column
                title="Fecha de entrega"
                key="fechaEntrega"
                dataIndex="fechaEntrega"
                />
                <Table.Column
                title="Monto entregado"
                render={(_, record)=>(
                    <p>{parseFloat(record.montoEntregado).toLocaleString("es-ES",{
                        style: "currency",
                        currency: "ARS"
                    })}</p>
                )}
                />
            </Table>
        </Modal>
    </>
  )
}

export default ViewHistoryDelivers