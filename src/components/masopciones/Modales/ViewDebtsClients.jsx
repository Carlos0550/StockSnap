import { Button, Divider, Flex, message, Modal, Skeleton, Spin, Table } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../../utils/contexto'
import MakeDeliver from '../AdministrarClientes/Hacer entregas/MakeDeliver';
import ViewHistoryDelivers from './ViewHistoryDelivers';

function ViewDebtsClients({ closeModal, clientId }) {
    const { widthValue, fetchViewDebtsClients, viewDebtsClient,deliversData,fetchAllDeliveries,deleteDebts } = useAppContext();
    const alreadyFetch = useRef(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [openMakeDeliver, setOpenMakeDeliver] = useState(false)
    const [openViewHistoryDeliveries, setOpenViewHistoryDeliveries] = useState(false)
    useEffect(() => {
        if (!alreadyFetch.current && clientId) {
            (async () => {
                setFetchingData(true);
                await fetchViewDebtsClients(clientId);
                await fetchAllDeliveries(clientId)
                setFetchingData(false);
            })();
        }
        alreadyFetch.current = true;
    }, [clientId]);



    let sumatoriaEntregas = 0;
    const processingDeliveriesData = () => {
        if (deliversData.length > 0) {
            let entregas = JSON.parse(deliversData[0].entregas);
            if (!Array.isArray(entregas)) {
                entregas = [entregas]
            }
            sumatoriaEntregas = entregas.reduce((acc, item) => {
                const monto = parseInt(item.monto);
    
                if (!isNaN(monto)) {
                    return acc + monto;
                } else {
                    console.warn("El valor del monto no es un número válido:", item.monto);
                    return acc;
                }
            }, 0); 
        }
    
        return sumatoriaEntregas;
    }
    processingDeliveriesData()

    // useEffect(()=>{
    //     console.log(deliversData)
    // },[deliversData])

    let parsedDeliveries = {};
    const processingDeliversToUpdate = () => {
        if (deliversData.length > 0) {
            let entregas = JSON.parse(deliversData[0].entregas);
            if (!Array.isArray(entregas)) {
                parsedDeliveries = {
                    id_cliente: deliversData[0].id_cliente,
                    id_entrega: deliversData[0].id_entrega,
                    entregas: [entregas]
                };
            } else {
                parsedDeliveries = {
                    id_cliente: deliversData[0].id_cliente,
                    id_entrega: deliversData[0].id_entrega,
                    entregas: entregas
                };
            }
        } else {
            // Inicializa parsedDeliveries si no hay datos
            parsedDeliveries = {
                id_cliente: clientId,
                entregas: []
            };
        }
        return parsedDeliveries;
    };
    processingDeliversToUpdate()
    let data = [];
    const totalAdeudado = viewDebtsClient.reduce((acc, item) => {
        return acc += item.total_adeudado
    }, 0)
    if (viewDebtsClient !== null && viewDebtsClient.length > 0) {
        
        data = viewDebtsClient.map((item, index) => {
            let contacto;
            let detalle = [];

            if (item.contacto !== undefined) {
                contacto = JSON.parse(item.contacto);
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
                detalle,
                nombreProducto: detalle.nombre_producto,
                fecha_deuda: item.fecha_deuda.split("T")[0],
                idDeuda: item.id_deuda,
                // totalAdeudado: totalAdeudado.toLocaleString("es-ES", { style: "currency", currency: "ARS" }),
            };
        });
    }
    const [cancellingDebts, setCancellingDebts] = useState(false)
    const handleCancelDebts = async() =>{
        setCancellingDebts(true)
        const hiddenMessage = message.loading("Cancelando deudas...",0)
        await deleteDebts(clientId)
        setCancellingDebts(false)
        hiddenMessage()
        closeModal()
    }

    const pageConfig = {
        pageSize: 10
    }

    return (
        <>
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
                        <h2>Total adeudado: {(totalAdeudado - sumatoriaEntregas).toLocaleString("es-ES", { style: "currency", currency: "ARS" })}</h2>
                        <Flex gap="middle">
                            <Button type='primary' danger onClick={()=> setOpenMakeDeliver(!openMakeDeliver)} disabled={cancellingDebts}>{openMakeDeliver ? "Cancelar" : "Hacer una entrega"}</Button>
                            <Button onClick={()=> setOpenViewHistoryDeliveries(true)} disabled={totalAdeudado - sumatoriaEntregas === 0 || cancellingDebts}>Ver registro de entregas</Button>
                            {totalAdeudado - sumatoriaEntregas === 0 ? <Button type='primary' danger onClick={handleCancelDebts} disabled={cancellingDebts}>{cancellingDebts ? <Spin/> : "Cancelar Deudas"}</Button> : ""}
                        </Flex>
                        {openMakeDeliver && <MakeDeliver totalAdeudado={totalAdeudado - sumatoriaEntregas} clientId={clientId} entregasParseadas={parsedDeliveries} closeComponent={()=> setOpenMakeDeliver(false)}/>}
                        {openViewHistoryDeliveries && <ViewHistoryDelivers parsedDeliveries={parsedDeliveries.entregas} closeModal={()=> setOpenViewHistoryDeliveries(false)}/>}
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
        </>
    );
}

export default ViewDebtsClients;
