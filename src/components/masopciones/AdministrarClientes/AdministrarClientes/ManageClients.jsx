import { Button, Modal, Spin, Table } from 'antd'
import React, { useState } from 'react'
import { useAppContext } from '../../../../utils/contexto'
import Search from 'antd/es/transfer/search'
import ViewDebtsClients from '../../Modales/ViewDebtsClients'

function ManageClients({ closeModal, addingDebt,carrito, totalAdeudado  }) {
    const { clients, addDebt, debts,updateDebt,getFullDate } = useAppContext()
    const clientes = clients.data
    const [searchText, setSearchText] = useState('')
    const [updatingDebt, setUpdatingDebt] = useState(false)
    const [addingDebtServer, setAddingDebt] = useState(false)
    const [openModalViewDebtsClients, setOpenModalViewDebtsClients] = useState(false)
    let data;
    if (clientes && clientes.length > 0) {
        data = clientes
            .sort((a, b) => a.id_cliente - b.id_cliente)
            .filter((name)=> name.nombre_completo.toLowerCase().includes(searchText.toLowerCase()))
            .map((cliente, index) => {
                const contact = JSON.parse(cliente.contacto)
                
                return {
                    key: index.toString(),
                    nombreCliente: cliente.nombre_completo,
                    idCliente: cliente.id_cliente,
                    dni: cliente.dni,
                    apodo: cliente.apodo,
                    contactoTelefono: contact.telefono,
                    contactoDireccion: contact.direccion
                }
            })
    }

    const pageConfiguration = {
        size: 5
    }

    const handlePushDebt = async(clientId) =>{
        const values = {
            clientId,
            carrito, 
            totalAdeudado
        }
        const today = getFullDate()
        const existingDebt = debts.find(debts => debts.id_cliente === clientId)
        if (existingDebt) {
            const existingDate = new Date(existingDebt.fecha_deuda).toISOString().split("T")[0]
            
            if (existingDate === today) {
                let existingDetalle = JSON.parse(existingDebt.detalle_deuda)
                const updatedDetalle = [...existingDetalle, ...carrito]

                const updatedTotal = existingDebt.total_adeudado + totalAdeudado
                const updatedValues = {
                    clientId,
                    detalle_deuda: JSON.stringify(updatedDetalle),
                    totalAdeudado: updatedTotal
                };
                setUpdatingDebt(true)
                await updateDebt(updatedValues)
                setUpdatingDebt(false)
            }else{
                setAddingDebt(true)
                await addDebt(values)
                setAddingDebt(false)
            }
        }else{
            setAddingDebt(true)
            await addDebt(values)
            setAddingDebt(false)
        }
      };
      const [clientId, setId_cliente] = useState(null)
      const handleModalViewDebts = (id_cliente) =>{
        console.log(id_cliente)
        setOpenModalViewDebtsClients(!openModalViewDebtsClients)
        setId_cliente(id_cliente)
      }
    return (
        <>
            <Modal
                open={true}
                onCancel={closeModal}
                width={2000}
                footer={[
                    <Button type='primary' danger onClick={closeModal}>Cerrar</Button>
                ]}
            >
                <Search
                placeholder="Buscar un producto"
                size="large"
                onChange={(e)=> setSearchText(e.target.value)}
                style={{ marginTop: "2rem" }}
                />
                <Table dataSource={data} pagination={pageConfiguration} scroll={{x:500}}>
                    <Table.Column
                    title="Nombre del cliente"
                    dataIndex="nombreCliente"
                    key="nombreCliente"
                    />
                    <Table.Column
                    title="DNI"
                    dataIndex="dni"
                    key="dni"
                    />
                    <Table.Column
                    title="Apodo"
                    dataIndex="apodo"
                    key="apodo"
                    />
                    <Table.Column
                        title="Telefono"
                        dataIndex="contactoTelefono"
                        key="contactoTelefono"
                    />
                    <Table.Column
                        title="Direccion"
                        dataIndex="contactoDireccion"
                        key="contactoDireccion"
                    />

                    <Table.Column
                    key="options"
                    render={(_, record) => (
                        <>
                        {!addingDebt && <Button type='primary' onClick={()=> handleModalViewDebts(record.idCliente)}>Ver deudas</Button>}
                        {addingDebt && <Button onClick={()=> handlePushDebt(record.idCliente)} disabled={addingDebtServer || updatingDebt}>{addingDebtServer || updatingDebt ? <Spin/> : "Agregar a este cliente"}</Button>}
                        </>
                    )}
                    />
                </Table>
            </Modal>

            {openModalViewDebtsClients && <ViewDebtsClients closeModal={handleModalViewDebts} clientId={clientId}/>}
        </>
    )
}

export default ManageClients