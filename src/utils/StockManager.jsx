import React,{ useEffect, useState, useRef } from 'react'
import { useAppContext } from './contexto'
import { Card, Empty, Tabs } from 'antd'
import AddStock from '../pages/Stock/AñadirStock/AddStock'

function StockManager() {
  const { activeTabStock, setActiveTabStock } = useAppContext()

  const tabItems = [
    {
      key: "1",
      label: "Listar Stock",
      children: "Listando stock"
    },
    {
      key: "2",
      label: "Añadir Stock",
      children: <AddStock/>
    }
  ]

  const handleChangeTab = (key) => {
    setActiveTabStock(key)
  }
  
  return (
    <>
      <div className="StockManager__wrapper">
        <Card
        title= "Administrador de Stock"
        style={{minWidth: "100%"}}
        >
          <Tabs
          activeKey={activeTabStock}
          onChange={handleChangeTab}
          items={tabItems}
          destroyInactiveTabPane
          >

          </Tabs>
        </Card>
      </div>
    </>
  )
}

export default StockManager