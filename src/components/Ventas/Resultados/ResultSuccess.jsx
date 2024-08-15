import React from 'react'
import {Result, Button} from "antd"
import { DoneAll,Print } from '@mui/icons-material'
function ResultSuccess() {
  return (
    <>
    <Result
          status="success"
          title="Venta concretada con éxito"
          subTitle="¿Desea imprimir un ticket como comprobante? Puede hacerlo más tarde si lo desea."
          extra={[
            <Button key="finish">Terminar <DoneAll /></Button>,
            <Button key="print">Imprimir comprobante <Print /></Button>
          ]}
        />
    </>
  )
}

export default ResultSuccess