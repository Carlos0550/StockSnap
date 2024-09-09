import React,{ useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../utils/contexto'
import { Empty } from 'antd'

function StockAndCategoriesManager() {
  const { userInfo, checkSession,fetchAllResources } = useAppContext()
  const alreadyFetch = useRef(false);
  useEffect(() => {
    if (userInfo.id === null || userInfo.access_token === null) {
      checkSession();
    } else {
      if (!alreadyFetch.current) {
        fetchAllResources();
        alreadyFetch.current = true;
      }
    }
  }, [userInfo]);
  return (
    <>
      <div className="StockAndCategories__wrapper">
          <Empty/>
      </div>
    </>
  )
}

export default StockAndCategoriesManager