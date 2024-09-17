export const processProvidersData = (providers) =>{
        if (providers && providers.length > 0) {
        return providers.map((item,index)=> {
            const detalles = JSON.parse(item.detalle_proveedor)
            if (detalles) {
                return {
                    index,
                    idProveedor: item.id_proveedor,
                    nombre: detalles.nombreProveedor,
                    email: detalles.contactoEmail,
                    telefono: detalles.contactoTelefono,
                    calle: detalles.direccionCalle,
                    codPostal: detalles.postal,
                    ciudad: detalles.direccionCiudad,
                    provincia: detalles.direccionProvincia,
                    cuit_cuil: detalles.cuit_cuil,
                    condicion: detalles.condicionIVA,
                    numeroCuenta: detalles.numeroCuenta,
                    banco: detalles.banco,
                    tipoCuenta: detalles.tipoCuenta
                }
            }
        })
    }else{
        return []
    }
}