import React,{ useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../utils/contexto'
import { Empty } from 'antd'

function StockManager() {
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
      <div className="StockManager__wrapper">
          heyyyy
      </div>
    </>
  )
}

export default StockManager