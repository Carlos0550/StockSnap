import { Button, Modal, Table } from 'antd'
import React from 'react'
import { useAppContext } from '../../../../utils/contexto'

function ManageClients({ closeModal }) {
    const { clients } = useAppContext()
    const clientes = clients.data
    let data;
    if (clientes && clientes.length > 0) {
        data = clientes
            .sort((a, b) => a.id_cliente - b.id_cliente)
            .map((cliente, index) => {
                return {
                    key: index.toString(),
                    nombreCliente: cliente.nombre_completo,
                    dni: cliente.dni,
                    apodo: cliente.apodo
                }
            })
    }

    const pageConfiguration = {
        size: 5
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
                    title="Contacto"
                    dataIndex="contacto"
                    key="contacto"
                    />

                    <Table.Column
                    key="options"
                    render={(_, record) => (
                        <Button type='primary'>Ver deudas</Button>
                    )}
                    />
                </Table>
            </Modal>
        </>
    )
}

export default ManageClients