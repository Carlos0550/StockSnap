import { Button, message, Modal, Table } from 'antd'
import React, { useEffect, useRef } from 'react'
import { useAppContext } from '../../../utils/contexto'

function ViewDebtsClients({ closeModal, clientId }) {
    const { widthValue, fetchViewDebtsClients, viewDebtsClient } = useAppContext()
    const alreadyFetch = useRef(false)
    useEffect(() => {
        if (!alreadyFetch.current && clientId) {
            (async () => {
                await fetchViewDebtsClients(clientId);
            })();
        }
        alreadyFetch.current = true;

    }, [clientId]);


    let data;

    if (viewDebtsClient) {
        data = viewDebtsClient
            .map((item, index) => {
                let contacto;
                let entregas;
                if (item.contacto !== undefined) {
                    contacto = JSON.parse(item.contacto)
                }
                if (item.entregas !== null && item.entregas !== undefined) {
                    entregas = JSON.parse(item.entregas)
                }
                return {
                    indexKey: index.toString(),
                    clientId: item.cliente_id,
                    nombreCompleto: item.nombre_completo,
                    direccionCliente: contacto?.direccion,
                    telefonoCliente: contacto?.telefono,
                    dni: item.dni,
                    apodo: item.apodo,
                    entregas,
                    fecha_deuda: item.fecha_deuda.split("T")[0],
                    idDeuda: item.id_deuda,
                    totalAdeudado: `$${item.total_adeudado}`.toLocaleString("es-ES")

                }
            })



    }
    // useEffect(()=>{

    // },[viewDebtsClient])
    return (
        <>
            <Modal
                width={widthValue}
                open={true}
                onCancel={closeModal}
                footer={[
                    <Button type='primary' danger onClick={closeModal}>Cerrar</Button>
                ]}
            >
                <Table
                    dataSource={data}
                    pagination={1}
                    scroll={{ x: 500 }}
                >
                    <Table.Column
                        title="Nombre del cliente"
                        dataIndex="nombreCompleto"
                        key="nombreCompleto"
                    />
                    <Table.Column
                        title="Fecha de compra"
                        dataIndex="fecha_deuda"
                        key="fecha_deuda"
                    />
                    <Table.Column
                        title="Total adeudado"
                        dataIndex="totalAdeudado"
                        key="totalAdeudado"
                    />
                    <Table.Column
                        title="Nombre del cliente"
                        dataIndex="nombreCompleto"
                        key="nombreCompleto"
                    />
                </Table>

            </Modal>
        </>
    )
}

export default ViewDebtsClients