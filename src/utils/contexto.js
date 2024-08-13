import React, { useContext, createContext, useEffect, useState, useRef } from "react"
import { supabase } from "../supabase";
import { message } from "antd";
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
            await fetchCategories()
            hiddenMessage()
            message.success("Categoria guardada", 2)
        } catch (error) {
            console.log(error)
            hiddenMessage()
            message.error("Hubo un problema al guardar la categoria", 2)

        }

    }

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
            await fetchProducts()
            message.success("Producto guardado", 2)

        } catch (error) {
            message.error("Hubo un problema al guardar la categoria", 2)
            console.log(error)
        }

    }

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

    const messageShowRef = useRef(false)
    const [sistemLoading, setSistemLoading] = useState(false)
    useEffect(() => {
        (async () => {
            if (messageShowRef.current) return;
            setSistemLoading(true);
            const hiddenMessage = message.loading("Preparando todo...", 0);
            messageShowRef.current = true;

            await Promise.all([fetchCategories(hiddenMessage), fetchProveedores(hiddenMessage), fetchProducts(hiddenMessage)]);

            hiddenMessage();
            setSistemLoading(false);
            message.success("Sistema listo");
        })();
    }, []);

    // useEffect(()=>{
    //     console.log("Categorias: ", categories)
    //     console.log("Proveedores: ",proveedores)
    //     console.log("Stock: ",products)       
    // },[categories,proveedores, products])


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

    const updateProduct = async (values) => {
        const { id_categoria, id_producto, id_proveedor, nombre_producto, precio, proveedor, stock } = values
        const { supressMessageUpdatingProducts } = values
        const hiddenMessage = !supressMessageUpdatingProducts && message.loading("Actualizando...", 0)
        try {
            const { error } = await supabase
                .from("productos")
                .update({
                    id_categoria: id_categoria,
                    id_proveedor: id_proveedor,
                    nombre_producto: nombre_producto,
                    precio_unitario: precio,
                    stock: stock
                })
                .eq("id_producto", id_producto)
            if (error) {
                if (!supressMessageUpdatingProducts) hiddenMessage()
                console.log(error)
                message.error("Hubo un error al actualizar el producto", 3)
            } else {
                if (!supressMessageUpdatingProducts) hiddenMessage()
                message.success("Producto actualizado!", 3)
                fetchProducts()
            }
        } catch (error) {
            console.log(error)
            if (!supressMessageUpdatingProducts) hiddenMessage()

            if (!supressMessageUpdatingProducts) message.error("Hubo un error al actualizar el producto", 3)
        }
    }

    const deleteProduct = async (id) => {
        console.log("me ejecuto")
        try {
            const hiddenMessage = message.loading("Eliminando producto...", 0)
            const response = await supabase
                .from("productos")
                .delete()
                .eq("id_producto", id)
            if (response.status === 204) {
                hiddenMessage()
                await fetchProducts()
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

    const updateProvider = async(values) =>{
        const {contacto} = values
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
                message.error("Hubo un error al actualizar la información del proveedor",3)
            }else{
                await fetchProveedores()
                message.success("Proveedor actualizado!", 3)
                
            }
        } catch (error) {
            console.log(error)
            message.error("Hubo un error al actualizar la información del proveedor",3)
        }
    }

    const deleteProvider = async (id_proveedor) => {
        try {
            const response = await supabase
                .from("proveedores")
                .delete()
                .eq("id_proveedor", id_proveedor)

            if (response.status === 204) {
                message.success("Proveedor eliminado correctamente!", 3)
                fetchProveedores()
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
            }else{
                message.success("Proveedor añadidocon éxito!")
                fetchProveedores()
                return;
            }
        } catch (error) {
            message.error("Error al añadir un proveedor", 3)
            message.info("Verifique la consola para más información")
            console.log(error)
        }
    }
    return (
        <AppContext.Provider value={{
            sistemLoading,
            insertProducts, products, updateProduct, deleteProduct,
            insertCategories, categories, toggleCategories,
            proveedores, toggleProviders, deleteProvider, addProvider,updateProvider
        }}>
            {children}
        </AppContext.Provider>
    )
} 