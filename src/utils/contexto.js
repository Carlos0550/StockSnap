import React, { useContext, createContext, useEffect, useState, useRef } from "react"
import { supabase } from "../supabase";
import { message, Result, Button, Modal } from "antd";
import axios from "axios"
import { useLocation } from "react-router-dom";
export const AppContext = createContext()

export const useAppContext = () => {
    const ctx = useContext(AppContext)
    if (!ctx) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return ctx
}

export const AppContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([])
    const [proveedores, setProveedores] = useState([])
    const [products, setProducts] = useState([])
    const [stockForSales, setStockForSales] = useState([])
    const [cart, setCart] = useState([])
    const [clients, setClients] = useState([])
    const [debts, setDebts] = useState([])
    const [widthValue, setWidthValue] = useState(window.innerWidth)
    const [viewDebtsClient, setViewDebtsClient] = useState([])
    const [deliversData, setDeliversData] = useState([])
    const getFullDate = () => {
        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const anio = fechaActual.getFullYear();


        return `${anio}-${mes}-${dia}`
    }

    useEffect(()=>{

        const handleResize = () =>{
            setWidthValue(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)

        return () =>{
            window.addEventListener("resize", handleResize)
        }

    },[])

    const fetchCategories = async (hiddenMessage) => {
        try {
            const { data: dataCategories, error: errorCategories } = await supabase
                .from("categorias")
                .select();

            if (errorCategories) {
                hiddenMessage()
                message.error("Hubo un error al cargar las categorías, por favor intente nuevamente", 3);
                console.log(errorCategories);
                return;
            }

            if (dataCategories) {
                setCategories(dataCategories);
            }
        } catch (error) {
            message.error("Hubo un error al cargar las categorías, por favor intente nuevamente", 3);
            console.log(error);
        }
    };

    const fetchProveedores = async (hiddenMessage) => {
        try {
            const { data: dataProveedores, error: errorProveedores } = await supabase
                .from("proveedores")
                .select();

            if (errorProveedores) {
                hiddenMessage()
                message.error("Hubo un error al cargar los proveedores, por favor intente nuevamente", 3);
                console.log(errorProveedores);
                return;
            }

            if (dataProveedores) {
                setProveedores(dataProveedores);
            }
        } catch (error) {
            hiddenMessage()
            message.error("Hubo un error al cargar los proveedores, por favor intente nuevamente", 3);
            console.log(error);
        }
    };

    const fetchProducts = async (hiddenMessage) => {
        try {
            const { data, error } = await supabase
                .from("vista_productos")
                .select()

            if (error) {
                hiddenMessage()
                message.error("Hubo un error al cargar los productos, por favor intente nuevamente", 3)
                console.log(error)
                return;
            } else {
                setProducts(data)
            }
        } catch (error) {
            hiddenMessage()
            message.error("Hubo un error al cargar los productos, por favor intente nuevamente", 3)
            console.log(error)
        }
    }

    const fetchStockForSales = async (hiddenMessage) => {
        try {
            const { data, error } = await supabase
                .from("vista_stock_para_ventas")
                .select()

            if (error) {
                console.log(error)
                hiddenMessage()
                message.error("Hubo un error al cargar el stock para la venta, por favor recarge la página!")
            } else {
                setStockForSales(data)
            }

        } catch (error) {
            hiddenMessage()

            console.log(error)
            message.error("Hubo un error al cargar el stock para la venta, por favor recarge la página!")
        }
    }

    const [spaceDisk, setSpaceDisk] = useState(null)
    const fetchUsageDisk = async (hiddenMessage) => {
        try {
            const response = await axios.post("https://stocksnap-server.vercel.app/check-space")
            if (!response) {
                hiddenMessage()
                setSpaceDisk({ code: 500 })
                message.error("Error al traer la información de uso del disco", 3)
                console.log(response)
            } else {
                setSpaceDisk(Math.floor(response.data.space))
            }
        } catch (error) {
            hiddenMessage()
            message.error("Error al traer la información de uso del disco", 3)
            console.log(error)
        }
    }

    const [salesHistory, setSalesHistory] = useState([])

    const fetchSalesHistory = async (hiddenMessage) => {
        try {
            const { data, error } = await supabase
                .from("ventas")
                .select()

            if (error) {
                hiddenMessage()
                message.error("Error al traer el historial de ventas, por favor, recargue la página")
                console.log(error)
                return;
            }
            if (data.length > 0) {
                setSalesHistory(data)
            }
        } catch (error) {
            hiddenMessage()
            message.error("Error al traer el historial de ventas, por favor, recargue la página")
            console.log(error)
        }
    }

    const fetchAllClients = async (hiddenMessage) => {
        try {
            const response = await axios.get("https://stocksnap-server.vercel.app/getAllClients");
            setClients(response.data); // Aquí ya asumes que la respuesta es exitosa
        } catch (error) {
            hiddenMessage();
            if (error.response) {
                // Errores de la respuesta del servidor (status != 2xx)
                message.error(`${error.response.data.message}`, 3);
            } else if (error.request) {
                // No se recibió respuesta del servidor
                message.error("No se recibió respuesta del servidor, por favor intente nuevamente", 3);
            } else {
                // Otros errores
                message.error("Error interno del servidor, por favor, intente nuevamente", 3);
            }
        }
    };

    const fetchAllDebts = async () => {
        setDebts([])

        try {
            const response = await axios.get("https://stocksnap-server.vercel.app/fetchAllDebts")
            if (response.status === 200) {
                return setDebts(response.data.data)
            } else {
                return message.error("Hubo un error desconocido al intentar traer las deudas", 4)
            }
        } catch (error) {
            console.log(error)
            message.error(`${error.response?.data.message}`, 3)
        }
    }

    


    const messageShowRef = useRef(false)
    const [sistemLoading, setSistemLoading] = useState(false)

    const fetchAll = async () => {
        const hiddenMessage = message.loading("Actualizando...", 0)
        await Promise.all([
            fetchCategories(hiddenMessage),
            fetchProveedores(hiddenMessage),
            fetchProducts(hiddenMessage),
            fetchStockForSales(hiddenMessage),
            fetchSalesHistory(hiddenMessage),
            fetchAllClients(hiddenMessage),
            fetchAllDebts(),
        ]);
        hiddenMessage()
    }
    const location = useLocation()
    useEffect(() => {
        if (location.pathname == "/home") {
            (async () => {
                if (messageShowRef.current) return;
                setSistemLoading(true);
                const hiddenMessage = message.loading("Preparando todo...", 0);
                messageShowRef.current = true;

                await Promise.all([
                    fetchCategories(hiddenMessage),
                    fetchProveedores(hiddenMessage),
                    fetchProducts(hiddenMessage),
                    fetchStockForSales(hiddenMessage),
                    fetchUsageDisk(hiddenMessage),
                    fetchSalesHistory(hiddenMessage),
                    fetchAllClients(hiddenMessage),
                    fetchAllDebts(),
                ]);

                hiddenMessage();
                setSistemLoading(false);
                message.success("Sistema listo");
            })();
        }
    }, [location.pathname]);


    const insertCategories = async (values) => {
        const hiddenMessage = message.loading("Guardando...", 0)
        try {
            const { data, error } = await supabase
                .from("categorias")
                .insert({
                    nombre_categoria: values.nombre_categoria,
                    descripcion: values.descripcion
                })

            if (error) {
                message.error("Hubo un problema al guardar la categoria", 2)
                console.log(error)
                return;
            }
            await fetchAll()
            hiddenMessage()
            message.success("Categoria guardada", 2)
        } catch (error) {
            console.log(error)
            hiddenMessage()
            message.error("Hubo un problema al guardar la categoria", 2)

        }

    }


    const toggleCategories = async (id, currentState) => {

        const hiddenMessage = message.info("Actualizando...", 0)
        try {
            const { error } = await supabase
                .from("categorias")
                .update({ "categoria_activa": !currentState })
                .eq("id_categoria", id)

            if (error) {
                hiddenMessage()
                message.error("Hubo un error al actualizar el estado de la categoria", 3)
                console.log(error)
                return;
            }

            hiddenMessage()
            await fetchCategories()
            message.success("Categoria actualizada", 3)


        } catch (error) {
            hiddenMessage()
            message.error("Hubo un error al actualizar el estado de la categoria", 3)
            console.log(error)
        }
    }

    const updateCategory = async (values) => {
        const hiddenMessage = message.loading("Aguarde...", 0)
        const { error } = await supabase
            .from("categorias")
            .update({
                nombre_categoria: values.nombre_categoria,
                descripcion: values.descripcion || ""
            })
            .eq("id_categoria", values.id_categoria)
        if (!error) {
            await fetchAll()
            hiddenMessage()
            message.success("Categoria actualizada!", 3)
        } else {
            message.error("Hubo un error al actualizar esta categoria", 3)
        }

    }

    const deleteCategory = async (values = [], categoryId) => {
        let hasError = false;
        let isForeignKeyError = false;
        const hiddenMessage = message.loading("Aguarde...", 0)

        for (let i = 0; i < values.length; i++) {
            const product = values[i];
            if (product?.id_categoria) {
                try {
                    const { error: updateError } = await supabase
                        .from("productos")
                        .update({ id_categoria: product.id_categoria })
                        .eq("id_producto", product.id_producto);

                    if (updateError) {
                        hasError = true;
                        console.log(updateError);
                        break;
                    }
                } catch (error) {
                    console.log(error);
                    hasError = true;
                    break;
                }
            }
        }

        try {
            if (!hasError && categoryId) {
                const { status, error: deleteError } = await supabase
                    .from("categorias")
                    .delete()
                    .eq("id_categoria", categoryId);

                if (status !== 204 || deleteError) {
                    if (deleteError?.message.includes('foreign key')) {
                        isForeignKeyError = true;
                    }
                    hasError = true;
                    console.log(deleteError);
                }
                await fetchAll()

                hiddenMessage()

                if (!hasError) {
                    message.success("Categoría eliminada");
                    fetchCategories();
                } else if (isForeignKeyError) {
                    message.warning("No se pudo eliminar la categoría porque está vinculada a productos.");
                } else {
                    message.error("Hubo un problema al eliminar la categoría.");
                }
            }
        } catch (error) {
            console.log(error);
            hasError = true;
        }
    };


    // useEffect(()=>{
    //     console.log("Categorias: ", categories)
    //     console.log("Proveedores: ",proveedores)
    //     console.log("Stock: ",products)       
    // },[categories,proveedores, products])

    const insertProducts = async (products) => {
        const { nombre_producto, descripcion, stock, precio_unitario, proveedor, categoria } = products
        const hiddenMessage = message.loading("Guardando...", 0)

        try {
            const { data, error } = await supabase
                .from("productos")
                .insert({
                    nombre_producto: nombre_producto,
                    descripcion: descripcion,
                    precio_unitario: parseFloat(precio_unitario),
                    stock: parseInt(stock),
                    id_categoria: categoria,
                    id_proveedor: proveedor
                })
            if (error) {
                message.error("Hubo un problema al guardar la categoria", 2)
                console.log(error)
                return;
            }
            hiddenMessage()
            await fetchAll()
            message.success("Producto guardado", 2)

        } catch (error) {
            message.error("Hubo un problema al guardar la categoria", 2)
            console.log(error)
        }

    }

    const updateProduct = async (values = []) => {
        let hasError = false
        const hiddenMessage = message.loading("Aguarde...", 0)

        try {
            if (values.length > 0) {
                for (let i = 0; i < values.length; i++) {
                    const element = values[i];
                    const { error } = await supabase
                        .from("productos")
                        .update({
                            id_categoria: element.id_categoria,
                            id_proveedor: element.id_proveedor,
                            nombre_producto: element.nombre_producto,
                            precio_unitario: element.precio,
                            stock: element.stock
                        })
                        .eq("id_producto", element.id_producto)
                    if (error) {
                        console.log(error)
                        hasError = true
                        message.error("Hubo un error al actualizar el producto", 3)
                        break;
                    }
                }
            }

            if (hasError) {
                return { code: 500, message: "Algo salio mal y no se pudo completar la operación" }
            } else {
                await fetchAll()
                hiddenMessage()
                return { code: 201, message: "Actualizacion exitosa!" }
            }
        } catch (error) {
            console.log(error)
            return { code: 500, message: "Algo salio mal y no se pudo completar la operación" }
        }
    }

    const deleteProduct = async (id) => {
        try {
            const hiddenMessage = message.loading("Eliminando producto...", 0)
            const response = await supabase
                .from("productos")
                .delete()
                .eq("id_producto", id)
            if (response.status === 204) {
                hiddenMessage()
                await fetchAll()
                message.success("Producto eliminado!", 3)

            } else {
                hiddenMessage()
                message.error("Error al eliminar el producto", 3)
                console.log(response.error)
            }
        } catch (error) {
            message.error("Error al eliminar el producto", 3)
            console.log(error)
        }
    }


    const toggleProviders = async (id, currentState) => {

        const hiddenMessage = message.info("Actualizando...", 0)
        try {
            const { error } = await supabase
                .from("proveedores")
                .update({ "proveedor_activo": !currentState })
                .eq("id_proveedor", id)

            if (error) {
                hiddenMessage()
                message.error("Hubo un error al actualizar el estado del proveedor", 3)
                console.log(error)
                return;
            }

            hiddenMessage()
            await fetchProveedores()
            message.success("Proveedor actualizada", 3)


        } catch (error) {
            hiddenMessage()
            message.error("Hubo un error al actualizar el estado del proveedor", 3)
            console.log(error)
        }
    }

    const updateProvider = async (values) => {
        const { contacto } = values
        const hiddenMessage = message.loading("Aguarde...", 0)

        try {
            const { error } = await supabase
                .from("proveedores")
                .update({
                    nombre_proveedor: values.nombreProveedor,
                    contacto: JSON.stringify(contacto)
                })
                .eq("id_proveedor", values.id_proveedor)

            if (error) {
                console.log(error)
                message.error("Hubo un error al actualizar la información del proveedor", 3)
            } else {
                await fetchAll()
                hiddenMessage()

                message.success("Proveedor actualizado!", 3)

            }
        } catch (error) {
            console.log(error)
            message.error("Hubo un error al actualizar la información del proveedor", 3)
        }
    }

    const deleteProvider = async (id_proveedor) => {
        const hiddenMessage = message.loading("Aguarde...", 0)

        try {
            const response = await supabase
                .from("proveedores")
                .delete()
                .eq("id_proveedor", id_proveedor)

            if (response.status === 204) {
                message.success("Proveedor eliminado correctamente!", 3)
                await fetchAll()
                hiddenMessage()

            } else {
                message.error("Hubo un error al eliminar el proveedor ", 3)
                console.log(response.error)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const addProvider = async (values) => {
        console.log(values)
        try {
            const { error } = await supabase
                .from("proveedores")
                .insert({
                    nombre_proveedor: values.nombreProveedor,
                    contacto: JSON.stringify(values.contacto)
                })

            if (error) {
                message.error("Error al añadirun proveedor", 3)
                message.info("Verifique la consola para más información")
                console.log(error)
                return;
            } else {
                await fetchAll()
                message.success("Proveedor añadido con éxito!")

                return;
            }
        } catch (error) {
            message.error("Error al añadir un proveedor", 3)
            message.info("Verifique la consola para más información")
            console.log(error)
        }
    }
    const [purchaseFailed, setPurchaseFailed] = useState(false)
    const [purchaseSuccess, setPurchaseSuccess] = useState(false)
    const [paymentMethod, setPeymentMethod] = useState('')
    const completeCashSale = async (paymentType, total) => {
        const fechaActual = new Date();

        const año = fechaActual.getFullYear();
        const mes = fechaActual.getMonth() + 1;
        const dia = fechaActual.getDate()
        const { error } = await supabase
            .from("ventas")
            .insert({
                fecha_venta: `${año}-${mes}-${dia}`,
                total,
                metodo_pago: paymentType,
                detalle_venta: JSON.stringify(cart)
            })

        if (error) {
            return { code: 500 }
        } else {
            setPeymentMethod(paymentType)
            setPurchaseSuccess(true)
            message.success("Venta exitosa!")
            await fetchAll()
            return { code: 201 }
        }
    }

    const updateStockInDb = async (values = []) => {
        const hiddenMessage = message.loading("Aguarde...", 0);
        try {
            for (let i = 0; i < values.length; i++) {
                const element = values[i];
                const quantity = element.quantity
                const { error } = await supabase
                    .from("productos")
                    .update({
                        stock: element.stock - quantity,
                    })
                    .eq("id_producto", element.id_producto);

                if (error) {
                    console.log("Error actualizando producto:", error);
                    throw new Error("Error actualizando producto");
                }
                setCart([])
            }

            await fetchAll()

            message.success("Stock actualizado exitosamente");
            setCart([]);
            return { code: 201 };
        } catch (error) {
            console.log("Error global:", error);
            message.error("Hubo un error actualizando el stock.");
        } finally {
            hiddenMessage();
        }
    };



    const createCLients = async (values) => {
        const contacto = JSON.stringify({
            direccion: values.direccion || "",
            telefono: values.telefono || ""
        });

        const dataClient = {
            nombre_completo: values.nombre_completo,
            dni: values.dni,
            apodo: values.apodo,
            contacto: contacto
        };

        try {
            const response = await axios.post("https://stocksnap-server.vercel.app/create-client", { dataClient });

            if (response.data.code === 201) {
                await fetchAllClients();
                message.success("¡Cliente creado exitosamente!", 3);
            } else if (response.data.code === 400) {
                message.warning("Hubo un problema al crear el cliente, por favor reintente nuevamente.", 4);
            } else if (response.data.code === 409) {
                message.warning("El DNI ingresado ya fue registrado.", 4);
            } else if (response.data.code === 500) {
                message.error("Hubo un error crítico al añadir el cliente, por favor reintente nuevamente.", 4);
            } else {
                message.warning("Error inesperado. Código de estado: " + response.data.code, 4);
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Hubo un error crítico al añadir el cliente, por favor reintente nuevamente.";
                message.error(errorMessage, 4);
            } else {
                message.error("Hubo un error crítico al añadir el cliente, por favor reintente nuevamente.", 4);
            }
        }
    };

    const fetchAllRelationDebts = async () =>{
        const hiddenMessage = message.loading("Aguarde...",0)
        try {
           await Promise.all[updateStockInDb(cart),fetchAllDebts()]
           setViewDebtsClient([])
           hiddenMessage()
        } catch (error) {
            console.log(error)
            hiddenMessage()
            message.error("Hubo un error al actualizar algún dato",3)
        }
    }

    const addDebt = async (values) => {
        try {
            const response = await axios.post("https://stocksnap-server.vercel.app/addDebt", { values });
            if (response.status === 200) {
                await fetchAllRelationDebts()
                
                return message.success(`${response.data.message}`, 3)
            } else if (response.status === 400) {
                return message.error(`${response.data.message}`, 3)
            }
        } catch (error) {
            console.log(error)
            return message.error(`${error.response.data.message}`, 3)
        }

    }

    

    const fetchViewDebtsClients = async(id_cliente) =>{
        setViewDebtsClient([])
        const hiddenMessage = message.loading("Trayendo vista de deudas...",0)
        try {
            const response = await axios.get(`https://stocksnap-server.vercel.app/getViewDebts?id_cliente=${id_cliente}`)
            if (response.status === 200) {
                hiddenMessage()
                return setViewDebtsClient(response.data)
            }else if(response.status === 400){
                hiddenMessage()
                setViewDebtsClient([])
                message.info("No existen deudas",3)
            }
        } catch (error) {   
            hiddenMessage()
            console.log(error)
            return message.error(error.response.data?.message)
        }
    }

    const updateDebt = async (updatedValues) => {
        try {
            const response = await axios.put("https://stocksnap-server.vercel.app/updateDebts", updatedValues);
            if (response.status === 200) {
                message.success(`${response.data.message}`,3)
                await updateStockInDb(cart)
                return;
            }else{
                message.error(`${response.data.message}`,4)
                return
            }
        } catch (error) {
            console.log(error);
            message.error(`${error.response.data.message}`,4)
            return;
        }
    };
    const makeDeliver = async (values, clientId) => {
        const serializedDelivers = JSON.stringify(values);
        try {
            const response = await axios.post("https://stocksnap-server.vercel.app/make-deliver", { clientId, serializedDelivers });
    
            if (response.status === 200) {
                message.success("Entrega guardada exitosamente")
                fetchAllDeliveries(clientId)
                return;
            } else {
                console.warn("Se recibió una respuesta inesperada:", response);
                message.warning(`Se recibio una respuesta inesperada, consulte la consola de desarrollador.`,4)
                return;
            }
        } catch (error) {
            if (error.response) {
                console.error("Error en la respuesta del servidor:", error.response.data);
                message.error("Error en la respuesta del servidor")
                if (error.response.status === 406) {
                    console.warn("Error: Ya existe una entrega con ese ID");
                    message.error("Error: Ya existe una entrega con ese ID")
                    return;
                } else {
                    console.error("Error inesperado:", error.response.data);
                    message.error("Error inesperado, consulte la consola de desarrollador para más información",4)
                    return;
                }
            } else {

                console.error("Error en la solicitud:", error.message);
                message.error("Error inesperado, consulte la consola de desarrollador para más información",4)
                return;
            }
        }
    };
    const updateDeliveries = async (values) => {
        try {
            const response = await axios.put("https://stocksnap-server.vercel.app/update-deliver", { values });
    
            if (response.status === 200) {
                message.success("Entrega actualizada exitosamente!");
                await fetchAllDeliveries(values.id_cliente)
            } else {
                const warningMessage = response.data.message || "No se realizaron cambios";
                message.warning(`Advertencia: ${warningMessage}`);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || "Error al actualizar la entrega";
                message.error(`Error de respuesta: ${errorMessage}`);
            } else if (error.request) {
                message.error("Error de solicitud: No se recibió respuesta del servidor");
            } else {
                message.error(`Error: ${error.message}`);
            }
        }
    };
    const fetchAllDeliveries = async (idCliente) =>{
        setDeliversData([])
        try {
            const response = await axios.get(`https://stocksnap-server.vercel.app/getDeliveries?id_cliente=${idCliente}`)
            if (response.status === 200) {
                setDeliversData(response.data)
                return;
            }else{
                message.warning("Hubo un error al traer todas las entregas de la base de datos",3)
                return;
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                console.warn(error.response)
                message.error("Error en la respuesta del servidor",3)
                return;
            }else{
                message.error("Hubo un problema de conexión y no se pudieron traer las entregas de la base de datos",4)
                return;
            }
        }
    }

    
    const deleteDebts = async(id_cliente) => {
        console.log(id_cliente);
        try {
            const response = await axios.delete(`https://stocksnap-server.vercel.app/deleteDebts?id_cliente=${id_cliente}`);
            
            if (response.status === 200) {
                await Promise.all([fetchAllDebts(), fetchAllDeliveries(id_cliente)]);
                message.success("Deudas canceladas exitosamente!", 3);
            } else if (response.status === 404) {
                message.warning("No se encontraron deudas o entregas para eliminar", 3);
            }
        } catch (error) {
            console.log(error);
            
            if (error.response) {
                if (error.response.status === 500) {
                    message.error("Error interno del servidor, por favor intente nuevamente", 3);
                } else {
                    message.error("Hubo un error desconocido, por favor recargue la página e intente nuevamente", 3);
                }
            } else {
                message.error("Error de conexión", 3);
            }
        }
    };
    


    return (
        <AppContext.Provider value={{
            sistemLoading,
            insertProducts, products, updateProduct, deleteProduct,
            insertCategories, categories, toggleCategories, deleteCategory, updateCategory,
            proveedores, toggleProviders, deleteProvider, addProvider, updateProvider,
            stockForSales, setCart, cart, setStockForSales, completeCashSale, purchaseSuccess, setPurchaseSuccess, setPurchaseFailed, purchaseFailed, updateStockInDb,
            spaceDisk,widthValue,
            salesHistory,
            createCLients, clients,deleteDebts,
            addDebt,getFullDate, debts,updateDebt,fetchViewDebtsClients, viewDebtsClient,makeDeliver, fetchAllDeliveries, deliversData,updateDeliveries
        }}>
            {children}
            {purchaseSuccess && (
                <Modal
                    open={true}
                    onCancel={() => setPurchaseSuccess(false)}
                    footer={[]}
                >
                    <Result
                        status="success"
                        title={`Compra en ${paymentMethod} realizada con exito!`}
                        subTitle="Puede encontrar esta venta registrada en más opciones -> Historial de ventas"
                        extra={[
                            <Button type="primary" onClick={() => setPurchaseSuccess(false)}>Terminar venta</Button>
                        ]}
                    />
                </Modal>
            )}
        </AppContext.Provider>
    )
} 