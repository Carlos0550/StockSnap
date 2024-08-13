import { Collapse, message } from 'antd';
import React, { useState, useEffect } from 'react';
import ListProviders from './Modales/ListarProveedores/ListProviders';
import AddProviders from './AñadirProveedor/AddProviders';
function ManageProviders() {
  const [activeKey, setActiveKey] = useState(null);
  const [modalListProvider, setModalListProvider] = useState(false);

  useEffect(() => {
    if (activeKey && activeKey[0] === "1") {
    setModalListProvider(true);
      setActiveKey(null); 
    }
  }, [activeKey]);

  const handleToggleModal = () => {
    setModalListProvider(prev => !prev);
  };

  const Items = [
    {
      key: "1",
      label: "Gestionar/listar proveedores",
      children: null,
    },
    {
      key: "2",
      label: "Añadir proveedor",
      children: <AddProviders/>, 
    },
  ];

  return (
    <>
      <Collapse
        items={Items}
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
       
      />


      {modalListProvider && <ListProviders handleToggleModal={handleToggleModal} />}
    </>
  );
}

export default ManageProviders;
