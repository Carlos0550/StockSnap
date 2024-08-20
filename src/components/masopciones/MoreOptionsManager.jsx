import { Collapse } from 'antd'
import React, { useEffect, useState } from 'react'
import ShowDIskInfo from './MostrarInfoDisco/ShowDIskInfo'
import SalesHistoryModal from './Modales/SalesHistoryModal'
import CreateClients from './AdministrarClientes/CrearClientes/CreateClients'
import ManageClients from './AdministrarClientes/AdministrarClientes/ManageClients'

function MoreOptionsManager() {
    const [activeKey, setActiveKey] = useState(null)
    const [activeModalSalesHistory, setActiveModalSalesHistory] = useState(false)
    const [activeModalListClients, setActiveModalListClients] = useState(false);

    useEffect(()=>{
        if (activeKey && activeKey[0] === "2") {
            setActiveModalSalesHistory(true)
            setActiveKey(null)        
        }
        if (activeKey && activeKey[0] === "4") {
            setActiveModalListClients(true)
            setActiveKey(null)
        }
    },[activeKey])
    const items = [
        {
            key: "1",
            label: "Consultar espacio disponible en el sistema",
            children:<ShowDIskInfo/>
        },
        {
            key: "2",
            label:"Revisar historial de ventas",
            children:null
        },
        {
            key: "3",
            label:"Crear un cliente",
            children: <CreateClients/>
        },
        {
            key: "4",
            label:"Gestionar Clientes",
            children: null
        }
    ]
  return (
    <>
        <Collapse accordion items={items} activeKey={activeKey} onChange={((value)=> setActiveKey(value))}/>
        {activeModalSalesHistory && <SalesHistoryModal closeModal={()=> setActiveModalSalesHistory(false)}/>}
        {activeModalListClients && <ManageClients closeModal={()=> setActiveModalListClients(false)}/>}
    </>
  )
}

export default MoreOptionsManager