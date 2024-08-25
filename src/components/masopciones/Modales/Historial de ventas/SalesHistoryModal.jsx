import { Button, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../../utils/contexto';
import dayjs from "dayjs";

function SalesHistoryModal({ closeModal }) {
    const { salesHistory } = useAppContext();
    const [widthValue, setWidthValue] = useState(window.innerWidth);
    const [showDetails, setShowDetails] = useState(false);
    const [details, setDetails] = useState([]);

    useEffect(() => {
        const handleWidth = () => {
            setWidthValue(window.innerWidth);
        };

        window.addEventListener("resize", handleWidth);

        return () => {
            window.removeEventListener("resize", handleWidth);
        };
    }, []);

    let data;
    if (salesHistory && salesHistory.length > 0) {
        data = salesHistory
            .slice()
            .sort((a, b) => a?.id_venta - b?.id_venta)
            .reverse()
            .map((sale, index) => ({
                key: index.toString(),
                idVenta: sale.id_venta,
                fechaVenta: sale.fecha_venta,
                totalVenta: `$${sale.total.toLocaleString("es-ES")}`,
                metodoPago: sale.metodo_pago,
                detalleVenta: sale.detalle_venta, 
            }));
    }

    const paginationConfig = {
        pageSize: 7,
    };

    const handleShowDetails = (detalleVenta) => {
        try {
            const parsedDetails = JSON.parse(detalleVenta);
            
            const filteredDetails = parsedDetails.map(item => ({
                nombre_producto: item.nombre_producto,
                precio_unitario: item.precio_unitario,
                quantity: item.quantity,
            }));
            setDetails(filteredDetails);
            setShowDetails(true); 
        } catch (e) {
            console.error("Error al parsear los detalles de la venta", e);
            setDetails([]);
        }
    };

    return (
        <>
            <Modal
                open={true}
                onCancel={closeModal}
                width={widthValue}
                footer={[
                    <Button type='primary' danger size='large' onClick={closeModal}>Cerrar</Button>,
                ]}
            >
                <Table
                    dataSource={data}
                    pagination={paginationConfig}
                    scroll={{ x: 500 }}
                >
                    <Table.Column
                        title="Fecha de venta"
                        dataIndex="fechaVenta"
                        key="fechaVenta"
                        render={(fechaVenta) => dayjs(fechaVenta).format('DD/MM/YYYY')}
                        sorter={(a, b) => new Date(a.fechaVenta) - new Date(b.fechaVenta)}
                    />
                    <Table.Column
                        title="Metodo de pago"
                        dataIndex="metodoPago"
                        key="metodoPago"
                    />
                    <Table.Column
                        title="Total"
                        dataIndex="totalVenta"
                        key="totalVenta"
                    />
                    <Table.Column
                        title=""
                        key="verDetalle"
                        render={(_, record) => (
                            <Button onClick={() => handleShowDetails(record.detalleVenta)}>Ver detalle</Button>
                        )}
                    />
                </Table>
            </Modal>

            
            {showDetails && (
                <Modal
                    open={showDetails}
                    onCancel={() => setShowDetails(false)}
                    footer={[
                        <Button type='primary' onClick={() => setShowDetails(false)}>Cerrar</Button>,
                    ]}
                >
                    <h3>Detalle de la Venta</h3>
                    <Table dataSource={details} pagination={false} rowKey={(record) => record.nombre_producto}>
                        <Table.Column title="Nombre del producto" dataIndex="nombre_producto" key="nombre_producto" />
                        <Table.Column title="Precio Unitario" dataIndex="precio_unitario" key="precio_unitario" render={precio => `$${precio.toLocaleString("es-ES")}`} />
                        <Table.Column title="Cantidad" dataIndex="quantity" key="quantity" />
                    </Table>
                </Modal>
            )}
        </>
    );
}

export default SalesHistoryModal;
