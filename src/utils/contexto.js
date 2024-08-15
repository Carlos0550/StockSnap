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
    const [stockForSales, setStockForSales] = useState([])

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

    const messageShowRef = useRef(false)
    const [sistemLoading, setSistemLoading] = useState(false)
    useEffect(() => {
        (async () => {
            if (messageShowRef.current) return;
            setSistemLoading(true);
            const hiddenMessage = message.loading("Preparando todo...", 0);
            messageShowRef.current = true;

            await Promise.all([fetchCategories(hiddenMessage), fetchProveedores(hiddenMessage), fetchProducts(hiddenMessage), fetchStockForSales(hiddenMessage)]);

            hiddenMessage();
            setSistemLoading(false);
            message.success("Sistema listo");
        })();
    }, []);


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
        const { error } = await supabase
            .from("categorias")
            .update({
                nombre_categoria: values.nombre_categoria,
                descripcion: values.descripcion || ""
            })
            .eq("id_categoria", values.id_categoria)
        if (!error) {
            await fetchCategories()
            message.success("Categoria actualizada!", 3)
        } else {
            message.error("Hubo un error al actualizar esta categoria", 3)
        }

    }

    const deleteCategory = async (values = [], categoryId) => {
        let hasError = false;
        let isForeignKeyError = false;

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
                        break;  // Detener el bucle si ocurre un error de actualización
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
            }
        } catch (error) {
            console.log(error);
            hasError = true;
        } finally {
            if (!hasError) {
                message.success("Categoría eliminada");
                fetchCategories();
            } else if (isForeignKeyError) {
                message.warning("No se pudo eliminar la categoría porque está vinculada a productos.");
            } else {
                message.error("Hubo un problema al eliminar la categoría.");
            }
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
            await fetchProducts()
            message.success("Producto guardado", 2)

        } catch (error) {
            message.error("Hubo un problema al guardar la categoria", 2)
            console.log(error)
        }

    }

    const updateProduct = async (values = []) => {
        let hasError = false

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
                return {code:500, message:"Algo salio mal y no se pudo completar la operación"}
            }else{
                await fetchProducts()
                return {code:201, message: "Actualizacion exitosa!"}
            }
        } catch (error) {
            console.log(error)
            return {code:500, message:"Algo salio mal y no se pudo completar la operación"}
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

    const updateProvider = async (values) => {
        const { contacto } = values
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
                await fetchProveedores()
                message.success("Proveedor actualizado!", 3)

            }
        } catch (error) {
            console.log(error)
            message.error("Hubo un error al actualizar la información del proveedor", 3)
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
            } else {
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
            insertCategories, categories, toggleCategories, deleteCategory, updateCategory,
            proveedores, toggleProviders, deleteProvider, addProvider, updateProvider,
            stockForSales,
        }}>
            {children}
        </AppContext.Provider>
    )
} 