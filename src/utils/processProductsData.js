import { processProvidersData } from "./processProvidersData"
const cortarString = (texto, long) => {
    if (texto && texto.length > long) {
        return texto.substring(0, long) + "..."
    }else{
        return texto
    }
}

export const processProductData = (products, providers) => {
    const processedProviders = processProvidersData(providers)
    if (products && products.length > 0) {
        return products.map((item) => ({
            id: item.id_producto,
            nombre: item.nombre_producto,
            precio: parseFloat(item.precio_unitario),
            stock: parseInt(item.stock),
            descripcion: cortarString(item.descripcion, 60) || "N/A",
            proveedor: processedProviders.find(p => p.idProveedor === item.id_proveedor)?.nombre ,
            id_proveedor: item.id_proveedor
        }))
    }else{
        return []
    }
}

