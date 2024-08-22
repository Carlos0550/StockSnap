import { Button, Divider, Flex, message, Modal, Skeleton, Table } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../../utils/contexto'

function ViewDebtsClients({ closeModal, clientId }) {
    const { widthValue, fetchViewDebtsClients, viewDebtsClient } = useAppContext();
    const alreadyFetch = useRef(false);
    const [fetchingData, setFetchingData] = useState(false);

    useEffect(() => {
        if (!alreadyFetch.current && clientId) {
            (async () => {
                setFetchingData(true);

                await fetchViewDebtsClients(clientId);
                setFetchingData(false);
            })();
        }
        alreadyFetch.current = true;
    }, [clientId]);

    let data = [];
    const totalAdeudado = viewDebtsClient.reduce((acc, item) => {
        return acc += item.total_adeudado
    }, 0)
    if (viewDebtsClient !== null && viewDebtsClient.length > 0) {
        
        data = viewDebtsClient.map((item, index) => {
            let contacto;
            let entregas;
            let detalle = [];

            if (item.contacto !== undefined) {
                contacto = JSON.parse(item.contacto);
            }
            if (item.entregas !== null && item.entregas !== undefined) {
                entregas = JSON.parse(item.entregas);
            }
            if (item.detalle_deuda !== undefined) {
                detalle = JSON.parse(item.detalle_deuda).map((producto) => ({
                    nombreProducto: producto.nombre_producto,
                    precioUnitario: producto.precio_unitario,
                    cantidad: producto.quantity
                }));
            }


            return {
                indexKey: index.toString(),
                clientId: item.cliente_id,
                entregas,
                detalle,
                nombreProducto: detalle.nombre_producto,
                fecha_deuda: item.fecha_deuda.split("T")[0],
                idDeuda: item.id_deuda,
                // totalAdeudado: totalAdeudado.toLocaleString("es-ES", { style: "currency", currency: "ARS" }),
            };
        });
    }

    const pageConfig = {
        pageSize: 10
    }

    return (
        <Modal
            width={widthValue}
            open={true}
            onCancel={closeModal}
            footer={[
                <Button type="primary" danger onClick={closeModal}>
                    Cerrar
                </Button>,
            ]}
        >
            {fetchingData ? (
                <Skeleton active />
            ) : (
                <>
                    {totalAdeudado > 0 ? <Flex gap="middle" vertical style={{marginBottom: "1rem"}} >
                        <h2>Total adeudado: {totalAdeudado.toLocaleString("es-ES", { style: "currency", currency: "ARS" })}</h2>
                        <Flex gap="middle">
                            <Button type='primary' danger>Hacer una entrega</Button>
                            <Button>Ver registro de entregas</Button>
                        </Flex>
                    </Flex> : ""}
                    <Table dataSource={data} pagination={pageConfig} scroll={{ x: 500 }}>
                        <Table.Column
                            title="Fecha de compra"

                            dataIndex="fecha_deuda"
                            key="fecha_deuda"
                        />

                        <Table.Column
                            title="Detalle de compra"
                            render={(_, record) => (
                                <div style={{ overflowY: "scroll", maxHeight: "35vh", minWidth: "300px" }}>
                                    {record.detalle.map((producto, i) => (
                                        <>
                                            <div key={i}>
                                                <p><strong></strong> </p>
                                                <h2>{producto.nombreProducto}</h2>
                                                <p><strong>Precio unitario:</strong> {producto.precioUnitario.toLocaleString("es-ES", { style: "currency", currency: "ARS" })}</p>
                                                <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                                            </div>
                                            <Divider />
                                        </>
                                    ))}
                                </div>
                            )}
                        />
                        
                    </Table>
                </>

            )}
        </Modal>
    );
}

export default ViewDebtsClients;
