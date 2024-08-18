import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../utils/contexto'
import { Progress, Result } from 'antd'
import "./showDiskInfo.css"
function ShowDIskInfo() {
    const {spaceDisk} = useAppContext()
    const [porcentageUsed, setPorcentageUsed] = useState(null)
    useEffect(()=>{
        if (spaceDisk) {
            setPorcentageUsed((spaceDisk / 500) * 100)
        }else if(spaceDisk.code === 500){
            setPorcentageUsed(0)
        }
    },[spaceDisk])
    const twoColors = {
        '0%': '#108ee9',
        '100%': '#87d068',
      };
      const conicColors = {
        '0%': '#87d068',
        '50%': '#ffe58f',
        '100%': '#ffccc7',
      };
  return (
    <>
     <div className='statistic__container'>
        <Progress
        type='circle'
        status={porcentageUsed > 85 ? "exception" : "success"}
        percent={porcentageUsed || 0}
        format={()=> porcentageUsed !== null ? `${porcentageUsed}%` : "0"}
        />

        <div className="statistic__info">
            <h1>Estado del uso del disco</h1>
            <p>Cada 15 días, el uso de la base de datos es reiniciado automaticamente, si supera el límite la aplicación pasará a un modo de solo lectura para evitar costos accidentales</p>
            <p><strong>Actualmente hay en uso {spaceDisk}MB de 500MB</strong>, es decir, <strong>aún tiene disponible {500 - spaceDisk}MB</strong></p>
        </div>
     </div>
    </>
  )
}

export default ShowDIskInfo