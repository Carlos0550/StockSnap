import { Button, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../utils/contexto'

function SalesHistoryModal({ closeModal }) {
    const { salesHistory } = useAppContext()
    const [widthValue, setWidthValue] = useState(window.innerWidth)

    useEffect(() => {
        const handleWidth = () => {
            setWidthValue(window.innerWidth)
        }

        window.addEventListener("resize", handleWidth)

        return () => {
            window.removeEventListener("resize", handleWidth)
        }
    }, [])

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
                detalleVenta: JSON.parse(sale.detalle_venta)
            }))
    }

    const paginationConfig = {
        pageSize: 7
    }
    return (
        <>
            <Modal
                open={true}
                onCancel={closeModal}
                width={widthValue}
                footer={[

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
                        key="fechaVenta"
                        render={(_,record)=> (
                            <>
                            <Button>Ver detalle</Button>
                            </>
                        )}
                    />
                    


                </Table>
            </Modal>
        </>
    )
}

export default SalesHistoryModal