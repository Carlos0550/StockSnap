import { Button, Divider, Flex, message, Modal, Skeleton, Spin, Table,notification } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../../utils/contexto'
import MakeDeliver from '../AdministrarClientes/Hacer entregas/MakeDeliver';
import ViewHistoryDelivers from './ViewHistoryDelivers';
import { TextField } from '@mui/material';


import "./CSS/viewDebtsClients.css"
function ViewDebtsClients({ closeModal, clientId }) {
    const { widthValue, fetchViewDebtsClients, viewDebtsClient, deliversData, fetchAllDeliveries, deleteDebts,deleteIndividualDebts } = useAppContext();
    const [api, contextHolder] = notification.useNotification();

    const alreadyFetch = useRef(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [openMakeDeliver, setOpenMakeDeliver] = useState(false)
    const [openViewHistoryDeliveries, setOpenViewHistoryDeliveries] = useState(false)
    // const [editProductDebtClient, setEditProductDebtClient] = useState(false)
    // const [selectedProduct, setSelectedProducto] = useState(null)
    const openNotification = () => {
        api.open({
          message: 'No es posible eliminar',
          showProgress:true,
          description:
            'Por seguridad, No se pueden eliminar productos cuando ya hay entregas hechas por el cliente',
          duration: 7,
        });
      };

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

    // const handleEditProduct = (productIdx) => {
    //     setSelectedProducto(viewDebtsClient[productIdx])
    //     setEditProductDebtClient(true)
    // }

    // const handleFieldChange = (index, field, value) => {
    //     const updatedDetails = JSON.parse(selectedProduct.detalle_deuda);
        
    //     updatedDetails[index][field] = value;
        

    //     setSelectedProducto({
    //         ...selectedProduct,
    //         detalle_deuda: JSON.stringify(updatedDetails)
    //     });
    // };

    
    console.log(viewDebtsClient)


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
    const handleCancelDebts = async () => {
        setCancellingDebts(true)
        const hiddenMessage = message.loading("Cancelando deudas...", 0)
        await deleteDebts(clientId)
        setCancellingDebts(false)
        hiddenMessage()
        closeModal()
    }

    const pageConfig = {
        pageSize: 10
    }

    const [deletingDebt, setDeletingDebt] = useState(false)
    const handleDeleteDebts = async(productIdx) =>{
        if (sumatoriaEntregas > 0) {
            openNotification()
            return
        }else{
            setDeletingDebt(true)
            await deleteIndividualDebts(productIdx)
            await fetchViewDebtsClients(clientId);
            await fetchAllDeliveries(clientId)
            setDeletingDebt(false)
        }
        
    }
    
    // const [updatingProduct, setUpdatingProduct] = useState(false) 
    // const handleSave = async() => { 
    //     let parsedProducts = JSON.parse(selectedProduct.detalle_deuda)
    //     const sumatoriaTotal = parsedProducts.reduce((acc, item)=>{
    //         let parsedPrice = parseInt(item.precio_unitario)
    //         return acc += parsedPrice * item.quantity
    //     },0)
    //     let updatedValues = {
    //         detalle_deuda: selectedProduct.detalle_deuda,
    //         totalAdeudado: sumatoriaTotal,
    //         clientId: clientId
    //     }
        
    //     if (sumatoriaEntregas > 0) {
    //         if (sumatoriaTotal < sumatoriaEntregas) {
    //             openNotification()
    //             return;
    //         }
    //         setUpdatingProduct(true)
    //         await updateDebt(updatedValues)
    //         await fetchViewDebtsClients(clientId);
    //         await fetchAllDeliveries(clientId)
    //         setUpdatingProduct(false)
    //     }else{
    //         setUpdatingProduct(true)
    //         await updateDebt(updatedValues)
    //         await fetchViewDebtsClients(clientId);
    //         await fetchAllDeliveries(clientId)
    //         setUpdatingProduct(false)
    //     }
    //     setEditProductDebtClient(false);
    // };


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
                        {totalAdeudado > 0 ? <Flex gap="middle" vertical style={{ marginBottom: "1rem" }} >
                            <h2>Total adeudado: {(totalAdeudado - sumatoriaEntregas).toLocaleString("es-ES", { style: "currency", currency: "ARS" })}</h2>
                            <Flex gap="middle">
                                <Button type='primary' danger onClick={() => setOpenMakeDeliver(!openMakeDeliver)} disabled={cancellingDebts}>{openMakeDeliver ? "Cancelar" : "Hacer una entrega"}</Button>
                                <Button onClick={() => setOpenViewHistoryDeliveries(true)} disabled={totalAdeudado - sumatoriaEntregas === 0 || cancellingDebts}>Ver registro de entregas</Button>
                                {totalAdeudado - sumatoriaEntregas === 0 ? <Button type='primary' danger onClick={handleCancelDebts} disabled={cancellingDebts}>{cancellingDebts ? <Spin /> : "Cancelar Deudas"}</Button> : ""}
                            </Flex>
                            {openMakeDeliver && <MakeDeliver totalAdeudado={totalAdeudado - sumatoriaEntregas} clientId={clientId} entregasParseadas={parsedDeliveries} closeComponent={() => setOpenMakeDeliver(false)} />}
                            {openViewHistoryDeliveries && <ViewHistoryDelivers parsedDeliveries={parsedDeliveries.entregas} closeModal={() => setOpenViewHistoryDeliveries(false)} />}
                        </Flex> : ""}
                        <Table dataSource={data} pagination={pageConfig} scroll={{ x: 500 }}>
                            <Table.Column
                                title="Fecha de compra"
                                key="fecha_deuda"
                                
                                render={(_, record) => (
                                    <Flex vertical style={{ gap: ".5rem", flex: "1 1 calc(50% - .5rem)" }}>
                                        <p><strong>Fecha de deuda: {record.fecha_deuda}</strong></p>
                                        <Button type='primary' danger onClick={() => handleDeleteDebts(record.idDeuda)} disabled={deletingDebt}>{deletingDebt ? <Spin/> : "Eliminar productos"}</Button>
                                    </Flex>
                                )}
                            />

                            <Table.Column
                                title="Detalle de compra"
                                
                                render={(_, record) => (
                                    <div style={{ overflowY: "scroll", maxHeight: "35vh", minWidth: "400px" }}>
                                        {record.detalle.map((producto, i) => (
                                            <>
                                                <div key={i}>
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

            {/* {editProductDebtClient && selectedProduct &&
                <>
                <Modal
                    open={true}
                    closeIcon={false}
                    footer={[
                        <Button type='primary' danger onClick={() => setEditProductDebtClient(false)}>Cerrar</Button>
                    ]}
                >
                    {selectedProduct && selectedProduct.detalle_deuda && JSON.parse(selectedProduct.detalle_deuda).map((producto, index) => (
                    <div key={producto.id_producto} className='editDebtProducts__container'>
                        <TextField
                            label="Nombre Producto"
                            value={producto.nombre_producto}
                            onChange={(e) => handleFieldChange(index, 'nombre_producto', e.target.value)}
                            fullWidth
                        />
                        
                        <TextField
                            label="Precio Unitario"
                            type="number"
                            value={producto.precio_unitario}
                            onChange={(e) => handleFieldChange(index, 'precio_unitario', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Cantidad"
                            type="number"
                            value={producto.quantity}
                            onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)}
                            fullWidth
                        />
                    <Divider/>
                    </div>
                ))}
                <button className='btn__saveProducts' disabled={updatingProduct} onClick={handleSave}>{updatingProduct ? <Spin/> : "Guardar Cambios"}</button>
          
                </Modal>
                
                </>
            } */}
{contextHolder}
        </>
    );
}

export default ViewDebtsClients;
