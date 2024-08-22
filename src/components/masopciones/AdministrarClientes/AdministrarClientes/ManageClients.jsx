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
        pageSize: 6,
    }

    const handlePushDebt = async (clientId) => {
        try {
            const values = {
                clientId,
                carrito, 
                totalAdeudado
            };
            
            const today = new Date().toISOString().split("T")[0];
            console.log("Fecha de hoy: ", today);
            
            const existingDebt = debts.find(debt => debt.id_cliente === clientId);
            
            if (existingDebt) {
                const existingDate = new Date(existingDebt.fecha_deuda).toISOString().split("T")[0];
                console.log("Fecha de la deuda", existingDate);
    
                // Comparar las fechas de forma robusta
                if (existingDate === today) {
                    console.log("Hay que actualizar");
    
                    const existingDetalle = JSON.parse(existingDebt.detalle_deuda);
                    const updatedDetalle = [...existingDetalle, ...carrito]; 
    
                    const updatedTotal = existingDebt.total_adeudado + totalAdeudado;
                    
                    const updatedValues = {
                        clientId,
                        detalle_deuda: JSON.stringify(updatedDetalle),
                        totalAdeudado: updatedTotal
                    };
    
                    setUpdatingDebt(true);
                    await updateDebt(updatedValues); // Manejo de actualización
                    setUpdatingDebt(false);
                    closeModal()
    
                } else {
                    console.log("Hay que añadir otra deuda");
    
                    setAddingDebt(true);
                    await addDebt(values); // Añadir nueva deuda
                    setAddingDebt(false);
                    closeModal()
                }
            } else {
                console.log("Hay que añadir otra deuda");
    
                setAddingDebt(true);
                await addDebt(values); // Añadir nueva deuda si no existe
                setAddingDebt(false);
                closeModal()
            }
    
        } catch (error) {
            console.error("Error al gestionar la deuda:", error);
        }
    };
    
      const [clientId, setId_cliente] = useState(null)
      const handleModalViewDebts = (id_cliente) =>{
        setId_cliente(id_cliente)
        setOpenModalViewDebtsClients(true)
        
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

            {openModalViewDebtsClients && <ViewDebtsClients closeModal={()=> setOpenModalViewDebtsClients(false)} clientId={clientId}/>}
        </>
    )
}

export default ManageClients