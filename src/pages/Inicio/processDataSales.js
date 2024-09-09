import { Button } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"

export const processDataSales = (vistaVentas) =>{
    console.log(vistaVentas)
    return vistaVentas.map((item,index)=>({
        idProducto: item.id_producto,
        nombre: item.nombre_producto,
        categoria: item.nombre_categoria,
        precio: item.precio_unitario,
        stock: item.stock
    }))
}

export const columnsTableSales = [
    {
        title: "Producto",
        key: "producto",
        dataIndex: "nombre"
    },
    {
        title: "Precio",
        key: "precio",
        dataIndex: "precio",
        render: (_,record) => (
            parseFloat(record.precio).toLocaleString("es-ES",{style: "currency", currency: "ARS"})
        )
    },
    {
        title: "Stock",
        key: "stock",
        dataIndex: "stock"
    },
    {
        title: "",
        key: "",
        render: (_,record) => (
            <>
                <Button><ShoppingCartOutlined/></Button>
            </>
        )
    },
    
]