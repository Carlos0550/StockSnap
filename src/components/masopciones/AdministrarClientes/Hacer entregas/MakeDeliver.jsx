import React, { useEffect, useRef, useState } from 'react';
import { TextField } from "@mui/material";
import { Button, ConfigProvider, DatePicker, message } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import "./makeDelivers.css";
import { useAppContext } from '../../../../utils/contexto';

function MakeDeliver({ totalAdeudado, clientId, entregasParseadas,closeComponent }) {
    const { makeDeliver, updateDeliveries } = useAppContext();
    const [parsedDeliveries, setParsedDeliveries] = useState([]);
    const [valuesDelivery, setValuesDelivery] = useState({
        monto: "",
        fecha_entrega: ""
    });
    const [updateDeliver, setUpdateDeliver] = useState(false);
    const alreadyProcessed = useRef(false);

    const handleChange = (e) => {
        setValuesDelivery((prevValues) => ({
            ...prevValues,
            monto: e.target.value
        }));
    };

    const handleDateChange = (date, dateString) => {
        setValuesDelivery((prevValues) => ({
            ...prevValues,
            fecha_entrega: dateString
        }));
    };

    const [errors, setErrors] = useState({
        monto: "",
        fecha_entrega: ""
    });
    
    useEffect(() => {
        if (entregasParseadas.entregas.length !== 0 && !alreadyProcessed.current) {
            setParsedDeliveries(entregasParseadas);
            setUpdateDeliver(true);
            alreadyProcessed.current = true;
        }
    }, [entregasParseadas]);

    const validateFields = () => {
        const error = {};
        let valid = true;

        if (String(valuesDelivery.monto).trim() === "") {
            error.monto = "El monto no puede estar vacío";
            valid = false;
        } else if (isNaN(parseFloat(valuesDelivery.monto)) || parseFloat(valuesDelivery.monto) <= 0) {
            error.monto = "El monto debe ser un número mayor a 0";
            valid = false;
        }

        if (String(valuesDelivery.fecha_entrega).trim() === "") {
            error.fecha_entrega = "La fecha de entrega es requerida.";
            valid = false;
        }

        if (parseFloat(valuesDelivery.monto) > totalAdeudado) {
            error.monto = "El monto no puede ser mayor al total de la deuda";
            valid = false;
        }

        setErrors(error);
        return valid;
    };

    const handleSubmit = async () => {
        if (validateFields()) {
            if (!updateDeliver) {
                await makeDeliver(valuesDelivery, clientId);
                closeComponent()
            } else {
               
                const nuevasEntregas = [...(parsedDeliveries.entregas || []), valuesDelivery];
                const datosActualizados = {
                    ...parsedDeliveries,
                    entregas: JSON.stringify(nuevasEntregas)
                };
                await updateDeliveries(datosActualizados);
                closeComponent()

            }
        }
    };
    

    return (
        <div className='deliver__component-wrapper'>
            <div className="deliver__inputs">
                <TextField
                    id='monto'
                    name='monto'
                    size='small'
                    label="Cantidad a entregar"
                    placeholder=''
                    onChange={handleChange}
                    error={!!errors.monto}
                    helperText={errors.monto}
                    fullWidth
                />
                <ConfigProvider locale={es_ES}>
                    <DatePicker
                        name='fecha_entrega'
                        id='fecha_entrega'
                        status={errors.fecha_entrega ? 'error' : ''}
                        onChange={handleDateChange}
                        size='large'
                    />
                    {errors.fecha_entrega && (
                        <p style={{ color: "#c01717" }}>La fecha es requerida</p>
                    )}
                </ConfigProvider>
            </div>
            <Button onClick={handleSubmit} className='btn__save-deliver'>
                Guardar entrega
            </Button>
        </div>
    );
}

export default MakeDeliver;
