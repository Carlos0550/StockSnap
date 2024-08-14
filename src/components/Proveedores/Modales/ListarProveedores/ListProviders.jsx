import { Button, Modal, Switch, Table, Space, message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../../utils/contexto';
import { json } from 'react-router-dom';
import { DeleteOutline, DrawOutlined } from '@mui/icons-material';
import EditStock from '../EditarStock/EditProvider';
import EditProvider from '../EditarStock/EditProvider';
function ListProviders({ handleToggleModal }) {
  const [widthValue, setWidthValue] = useState(window.innerWidth);
  const { proveedores, toggleProviders, products,updateProduct, deleteProvider } = useAppContext()
  const [switchDisabled, setSwitchDisabled] = useState(null)
  const [editProviderModal, setEditProviderModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)

  
  const handleEditModal = (id_prov) =>{
    setEditProviderModal(!editProviderModal)
    setSelectedProvider(proveedores.find((prov)=> prov.id_proveedor === id_prov))
  }

  const filteredProviders = proveedores.filter((prov)=> prov.nombre_proveedor !== "proveedor_eliminado")

  const handleDeleteProvider = async(lastId) =>{
    const filteredProducts = products.filter((prod) => prod.id_proveedor === lastId);
    const id_proveedor_eliminado = proveedores.find((prov)=> prov.nombre_proveedor === "proveedor_eliminado")
    if (!id_proveedor_eliminado) {
      message.error("Hubo un error al eliminar el proveedor, recargue la página e intente nuevamente",3)
      return;
    }

    const updatedProducts = filteredProducts.map(prod =>({
      ...prod,
      id_proveedor: id_proveedor_eliminado.id_proveedor,
      supressMessageUpdatingProducts:true
    }));

    for (const product of updatedProducts) {
      await updateProduct(product)
      
    }
    await deleteProvider(lastId)
  }

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

  // console.log("proveedores: ", proveedores);

  if (filteredProviders && filteredProviders.length > 0) {
    data = filteredProviders
      .slice()
      .sort((a, b) => a.id_proveedor - b.id_proveedor)
      .map((provider, index) => {
        let contact = {};

        if (provider.contacto) {
          try {
            contact = JSON.parse(provider.contacto);
          } catch (error) {
            console.error(`Error al parsear contacto para el proveedor con id ${provider.id_proveedor}:`, error);
            contact = {}; 
          }
        }

        return {
          key: index.toString(),
          id_proveedor: provider.id_proveedor,
          nombre_proveedor: provider.nombre_proveedor,
          contacto: {
            telefono: contact.telefono || "",
            email: contact.email || "",
            ubicacion: contact.ubicacion || "",
          },
          activo: provider.proveedor_activo,
          
        };
      });

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
    pageSize: 10
  }
  return (
    <>
    <Modal
      title="Administrar proveedores"
      open={true}
      onCancel={handleToggleModal}
      width={widthValue}
      style={{ top: 0, left: 0, right: 0 }}
      footer={[
        <Button key="cancel" type='primary' danger onClick={handleToggleModal}>
          Cerrar
        </Button>,
      ]}
    >
      <Table dataSource={data} pagination={paginationConfig} scroll={{ x: 800 }}>
      <Table.Column
          title="#"
          dataIndex="key"
          key="key"
        />
        <Table.Column
          title="Nombre Proveedor"
          dataIndex="nombre_proveedor"
          key="nombreProveedor"
        />
        <Table.Column
          title="Contacto"
          key="contactoProveedor"
          render={(_, record) => (
            <div>
              <p>Teléfono: {record.contacto.telefono}</p>
              <p>Email: {record.contacto.email}</p>
              <p>Ubicación: {record.contacto.ubicacion}</p>
            </div>
          )}
        />
        <Table.Column
          title="¿Está activo?"
          key="proveedorActivo"
          render={(_, record) => (
            <Space size="middle" wrap vertical>
              <Switch
                checked={record.activo}
                disabled={switchDisabled?.key === record.key}
                style={{ backgroundColor: record.activo ? "green" : "#cccddd" }}
                onChange={() => handleToggle(record.key, record.activo)}
              />
              <Popconfirm 
              onConfirm={()=>handleDeleteProvider(record.id_proveedor)}
              title="¿Esta seguro de eliminar esta categoria?"
              description="Todos los productos asociados a esta categoria apareceran con el nombre de 'Proveedor eliminado'"
              cancelText="Cancelar"
              okText="Eliminar"
              okType='danger'
              
              >
                <Button type='primary' danger ><DeleteOutline/></Button>
              </Popconfirm>
              <Button type='primary' onClick={()=>handleEditModal(record.id_proveedor)}><DrawOutlined/></Button>
            </Space>
          )}
        />

      </Table>
    </Modal>
    {editProviderModal && <EditProvider closeModal={handleEditModal} selectedProvider={selectedProvider}/>}
    </>
  )
}

export default ListProviders