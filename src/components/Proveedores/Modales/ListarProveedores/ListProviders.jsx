import { Button, Modal, Switch, Table, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../../utils/contexto';
import { json } from 'react-router-dom';

function ListProviders({ handleToggleModal }) {
    const [widthValue, setWidthValue] = useState(window.innerWidth);
    const {proveedores, toggleProviders} = useAppContext()

    const [switchDisabled, setSwitchDisabled] = useState(null)

    


    useEffect(() => {
      const handleResize = () => {
        setWidthValue(window.innerWidth);
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    let data;
    let contact;
    if (proveedores && proveedores.length > 0) {
      contact = JSON.stringify(proveedores.contacto)
      data = proveedores
      .slice()
      .sort((a,b)=> a.id_proveedor - b.id_proveedor)
      .map((provider, index)=>({
        key: index.toString(),
        id_proveedor: provider.id_proveedor,
        nombre_proveedor: provider.nombre_proveedor,
        contacto: contact,
        activo: provider.proveedor_activo
      }))
    }

    const handleToggle = async (key, checked) => {
      console.log("Key: ", key)
      console.log("Checked: ", checked)
      setSwitchDisabled({
        key: key,
        status: true,
      });
      const provider = proveedores.find(prov => prov.id_proveedor === data[key].id_proveedor);
      await toggleProviders(provider.id_proveedor, checked);
      setSwitchDisabled({
        key: null,
        status: false,
      });
    };
    const paginationConfig = {
      pageSize: 5
    }
  return (
    <Modal
      title="Añadir proveedores"
      open={true}
      onCancel={handleToggleModal}
      width={widthValue}
      style={{ top: 0, left:0, right:0 }}
      footer={[
        <Button key="cancel" onClick={handleToggleModal}>
          Cancelar
        </Button>,
      ]}
    >
      <Table dataSource={data} pagination={paginationConfig} scroll={{ x: 800 }}>
          <Table.Column 
            title="Nombre Proveedor"
            dataIndex="nombre_proveedor"
            key="nombreProveedor"
          />
          <Table.Column 
            title="Contacto"
            dataIndex="contacto_proveedor"
            key="contactoProveedor"
          />
          <Table.Column 
            title=""
            key="proveedorActivo"
            render={(_, record)=>(
              <Space size="middle">
                <Switch
                  checked={record.activo}
                  disabled={switchDisabled ?.key === record.key}
                  style={{ backgroundColor: record.activo ? "green" : "#cccddd" }}
                  onChange={() => handleToggle(record.key, record.activo)}
                />
              </Space>
            )}
          />
          
      </Table>
    </Modal>
  )
}

export default ListProviders