import { Collapse } from 'antd'
import React, { useEffect, useState } from 'react'

function MoreOptionsManager() {
    const [activeKey, setActiveKey] = useState(null)
    const [activeModalQueryDb, setActiveModalQueryDb] = useState(false)


    useEffect(()=>{
        if (activeKey === "2") {
            setActiveModalQueryDb(true)
            setActiveKey(null)        
        }
    },[activeKey])
    const items = [
        {
            key: "1",
            label: "Consultar espacio disponible en el sistema",
            render:null
        },
        {
            key: "2",
            label:"Revisar historial de ventas",
            render:null
        }
    ]
  return (
    <>
        <Collapse accordion items={items} activeKey={activeKey} onChange={((value)=> setActiveKey(value))}/>
    </>
  )
}

export default MoreOptionsManager