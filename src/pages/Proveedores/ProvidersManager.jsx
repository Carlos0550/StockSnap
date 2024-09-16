import { Button, Card, Flex, Table, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../utils/contexto';
import { processProvidersData } from './utils/processProvidersData';
import AddProvider from './Modales/AñadirProveedor/AddProvider';
import "./css/providersManager.css";
import Edit from '../../utils/SVGs/Edit';
import DeleteIcon from '../../utils/SVGs/DeleteIcon';

function ProvidersManager() {
  const { proveedores } = useAppContext();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editingProvider, setEditingProvider] = useState(false);
  const [ID_provider, setID_provider]= useState(null)
  const [activeTab, setActiveTab] = useState("1");

  const processedProviders = processProvidersData(proveedores);

  const handleEdit = (ID) => {
    setSelectedProvider(processedProviders.find(prov => prov.idProveedor === ID));
    setID_provider(ID)
    setEditingProvider(true);
    setActiveTab("2");
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (activeTab === "1") {
      setSelectedProvider(null);
      setEditingProvider(false)
    }
  }, [activeTab, editingProvider]);

  const tableColumns = [
    {
      title: "Proveedor",
      key: "nombre",
      render: (_,record) => (
        <h4>{record.nombre}</h4>
      )
    },
    {
      title: "Contacto",
      key: "contact",
      render: (_,record) => (
        <>
          <strong>Email: </strong>{record.email} <br />
          <strong>Teléfono: </strong>{record.telefono} <br />
          <strong>Dirección: </strong>{record.calle} <br />
          <strong>Cód. Postal: </strong>{record.codPostal} <br />
          <strong>Ciudad: </strong>{record.ciudad} <br />
          <strong>Provincia: </strong>{record.provincia}
        </>
      )
    },
    {
      title: "Información Fiscal",
      key: "fiscal_info",
      render: (_, record) => (
        <>
          <strong>Cuit/Cuil: </strong>{record.cuit_cuil} <br />
          <strong>Condición Fiscal: </strong>{record.condicion}
        </>
      )
    },
    {
      title: "Información Bancaria",
      key: "banc_info",
      render: (_,record) => (
        <>
          <strong>Alias/CBU/CVU: </strong>{record.numeroCuenta} <br />
          <strong>Banco: </strong>{record.banco} <br />
          <strong>Tipo de cuenta: </strong> {record.tipoCuenta}
        </>
      )
    },
    {
      render: (_,record) => (
        <Flex gap="small" wrap>
          <Button type='primary' onClick={() => handleEdit(record.idProveedor)}><Edit/></Button>
          <Button type='primary' danger><DeleteIcon/></Button>
        </Flex>
      )
    }
  ];

  const tabItems = [
    {
      key: "1",
      label: 'Listar Proveedores',
      children: (
        <Table
          columns={tableColumns}
          dataSource={processedProviders}
          scroll={{x:500}}
          style={{minWidth:"100%"}}
        />
      )
    },
    {
      key: "2",
      label: "Añadir Proveedores",
      children: <AddProvider editing={editingProvider} selectedProvider={selectedProvider} idProveedor={ID_provider}/>
    }
  ];

  return (
    <div className="providerManager__wrapper">
      <Card title="Proveedores" style={{minWidth:"100%"}}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          destroyInactiveTabPane
        />
      </Card>
    </div>
  );
}

export default ProvidersManager;
