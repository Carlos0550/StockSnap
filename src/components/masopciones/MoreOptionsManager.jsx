import { Collapse } from 'antd'
import React, { useEffect, useState } from 'react'
import ShowDIskInfo from './MostrarInfoDisco/ShowDIskInfo'
import SalesHistoryModal from './Modales/SalesHistoryModal'

function MoreOptionsManager() {
    const [activeKey, setActiveKey] = useState(null)
    const [activeModalSalesHistory, setActiveModalSalesHistory] = useState(false)


    useEffect(()=>{
        if (activeKey && activeKey[0] === "2") {
            setActiveModalSalesHistory(true)
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
        }
    ]
  return (
    <>
        <Collapse accordion items={items} activeKey={activeKey} onChange={((value)=> setActiveKey(value))}/>
        {activeModalSalesHistory && <SalesHistoryModal closeModal={()=> setActiveModalSalesHistory(false)}/>}
    </>
  )
}

export default MoreOptionsManager