export const processDataSales = (vistaVentas) =>{
    return vistaVentas.map((item,index)=>({
        idProducto: item.id_producto,
        nombre: item.nombre_producto,
        categoria: item.nombre_categoria,
        precio: item.precio_unitario,
        stock: item.stock
    }))
}



