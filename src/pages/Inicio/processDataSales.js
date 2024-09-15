export const processDataSales = (vistaVentas) =>{
    return vistaVentas
    .filter(itm => itm.stock > 0)
    .sort((a,b) => a.id_producto - b.id_producto)
    .map((item,index)=>({
        idProducto: item.id_producto,
        nombre: item.nombre_producto,
        categoria: item.nombre_categoria,
        precio: item.precio_unitario,
        stock: item.stock
    }))
}

export const cartSum = (cart) => {
    console.log(cart);
    if (cart.length > 0) {
        const total = cart.reduce((acc, item) => {
            return acc + parseFloat(item.precio) * parseInt(item.quantity);
        }, 0);
        console.log(total);
        return total
    } else {
        return 0; 
    }
};




