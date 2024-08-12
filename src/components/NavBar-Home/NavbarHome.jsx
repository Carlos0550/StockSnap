import React from 'react'
import "./navbarHome.css"
import { Button } from 'antd'
function NavbarHome() {
  return (
    <>
    <header className='header'>
        <div className='logo'>
            <h1>Stock Snap</h1>
        </div>
        <div className="button-nav">
            <Button type='primary' danger  >Cerrar sesión</Button>
        </div>
    </header>
    </>
  )
}

export default NavbarHome