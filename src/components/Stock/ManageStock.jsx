import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import "./manageStock.css";
import { Button, Collapse, Divider, message, Select, Flex, Modal } from 'antd';
import ManageCategories from '../Categorias/ManageCategories';
import { useAppContext } from '../../utils/contexto';
import RevisionProductoModal from "./Modales/RevisionProducto/RevisionProductoModal"
import ListAndManageStock from "./ListarYAdministrarStock/ListAndManageStock"
const { Option } = Select;



function ManageStock() {
    const [widthValue, setWIdthValue] = useState(window.innerWidth)
    useEffect(()=>{
        const handleResize = () =>{
            setWIdthValue(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)

        return (()=>{
            window.removeEventListener("resize", handleResize)
        })
    },[])



    const [modalOpen, setModalOpen] = useState(false);
    const { categories, proveedores } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [selectedProveedor, setSelectedProveedor] = useState(null);

    const filteredCategories = categories.filter(cat => cat.categoria_activa === true);
    const filteredProviders = proveedores.filter(prov => prov.proveedor_activo === true && prov.nombre_proveedor !== "proveedor_eliminado")
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const [values, setValues] = useState({
        nombre_producto: "",
        precio_unitario: "",
        stock: "",
        categoria: "",
        proveedor: ""
    });

    const [errors, setErrors] = useState({
        nombre_producto: "",
        precio_unitario: "",
        stock: "",
        categoria: "",
        proveedor: ""
    });

    useEffect(() => {
        if (!filteredCategories || filteredCategories.length === 0) return;
        if (!filteredProviders || filteredProviders.length === 0) return;
    }, [categories, proveedores]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [id]: value.trim() === "" ? "Este campo es obligatorio" : ""
        }));
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value); 
        setValues(prevValues => ({
            ...prevValues,
            categoria: value 
        }));
    };

    const handleProveedorChange = (value) => {
        setSelectedProveedor(value);
        setValues(prevValues => ({
            ...prevValues,
            proveedor: value
        }));
    };

    const capitalizeLabel = (label) => {
        const firstLetter = label.charAt(0);
        return label
            .replace("_", " ")
            .toLowerCase()
            .replace(firstLetter, char => char.toUpperCase());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        let hasError = false;

        Object.keys(values).forEach(key => {
            if (typeof values[key] === "string" && values[key].trim() === "") {
                newErrors[key] = "Este campo es obligatorio";
                hasError = true;
            } else if (typeof values[key] === "number" && (isNaN(values[key]) || values[key] <= 0)) {
                newErrors[key] = "Este campo es obligatorio";
                hasError = true;
            }
        });

        const stockValue = parseFloat(values.stock);
        if (isNaN(stockValue) || stockValue <= 0) {
            newErrors.stock = "El stock debe ser un número mayor a 0";
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            toggleModal();
        }
    };

    const keys = Object.keys(values).filter(key => key !== "categoria" && key !== "proveedor");
    
    const clearFields = () => {
        setValues({
            nombre_producto: "",
            precio_unitario: "",
            stock: "",
            categoria: "",
            proveedor: ""
        });
        setSelectedCategory(null);
        setSelectedProveedor(null);
    };

    const RenderUploadProduct = () => {
        return (
            <>
                {keys.map((key, index) => (
                    (index % 2 === 0) ? (
                        <div className="flex-cont" key={key}>
                            <TextField
                                id={key}
                                label={capitalizeLabel(key)}
                                variant="standard"
                                value={values[key]}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                error={!!errors[key]}
                                helperText={errors[key]}
                            />
                            {index + 1 < keys.length && (
                                <TextField
                                    id={keys[index + 1]}
                                    label={capitalizeLabel(keys[index + 1])}
                                    variant="standard"
                                    value={values[keys[index + 1]]}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors[keys[index + 1]]}
                                    margin="normal"
                                    helperText={errors[keys[index + 1]]}
                                />
                            )}
                        </div>
                    ) : null
                ))}
                <Divider orientation='left'>Seleccione la categoría y el proveedor</Divider>
                <div className="flex-cont" style={{flexDirection: widthValue < 768 ? "column" : "row"}}>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        placeholder="Selecciona una categoría"
                        style={{ margin: '1rem', width: "100%" }}
                    >
                        {filteredCategories.map((category) => (
                            <Option key={category.id_categoria} value={category.id_categoria}>
                                {category.nombre_categoria}
                            </Option>
                        ))}
                    </Select>
                    {errors.categoria && <div className="error">{errors.categoria}</div>}

                    <Select
                        value={selectedProveedor}
                        onChange={handleProveedorChange}
                        placeholder="Selecciona un proveedor"
                        style={{ margin: '1rem', width: "100%" }}
                    >
                        {filteredProviders.map((proveedor) => (
                            <Option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                {proveedor.nombre_proveedor}
                            </Option>
                        ))}
                    </Select>
                    {errors.proveedor && <div className="error">{errors.proveedor}</div>}
                </div>

                <Flex gap="middle">
                    <Button onClick={handleSubmit}>
                        Guardar producto
                    </Button>
                    <Button onClick={clearFields} type='primary' danger>
                        Limpiar todo
                    </Button>
                </Flex>
            </>
        );
    };


    const [openModalListStock, setOpenModalListStock] = useState(false)
    const [keyValue, setKeyValue] = useState(null)

    const toggleModalListStock = () => {
        setOpenModalListStock(!openModalListStock)

    }

    useEffect(()=>{
        if (keyValue && keyValue[0] === "3") {
            setOpenModalListStock(true)
            setKeyValue(null)
        }
    },[keyValue])
    const RenderListStock = () =>{
        return(
            <>
                <Modal
                onCancel={toggleModalListStock}
                open={true}
                width={widthValue}
                footer={[
                    <Button type='primary' danger onClick={toggleModalListStock}>Cerrar</Button>
                ]}
                >
                    <ListAndManageStock />
                </Modal>
            </>
        )
    }

    const Items = [
        {
            key: "1",
            label: "Administrar categorías",
            children: <ManageCategories />
        },
        {
            key: "2",
            label: "Subir un producto",
            children: RenderUploadProduct()
        },
        {
            key: "3", 
            label: "Gestionar stock",
            children: null
        }
    ];

    return (
        <>
        <div className='manager__stock-wrapper'>
            <Collapse accordion 
            activeKey={keyValue}
            onChange={(key)=> setKeyValue(key)}
            
            items={Items} />
            {modalOpen && (
                <RevisionProductoModal 
                    closeModal={() => toggleModal()} 
                    product={values} 
                    capitalizeLabel={capitalizeLabel} 
                    proveedores={proveedores} 
                    categorias={categories} 
                    setter={setValues}
                    setterCategorias={setSelectedCategory}
                    setterProveedores={setSelectedProveedor}
                />
            )}
        </div>
        {openModalListStock && RenderListStock()}
        </>
    );
}

export default ManageStock;
