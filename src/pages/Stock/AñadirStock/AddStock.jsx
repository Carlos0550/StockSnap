import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, notification, Row, Select, Tag } from 'antd';
import { useAppContext } from '../../../utils/contexto';
import { processProvidersData } from '../../../utils/processProvidersData';

const { Option } = Select;

function AddStock({editing, selectedProduct}) {
  const { proveedores,addStock,updateProduct, setActiveTabStock } = useAppContext();
  const [api, contextHolder] = notification.useNotification();
  const processedProviders = processProvidersData(proveedores);
  const [savingProduct, setSavingProduct] = useState(false)
  const [form] = Form.useForm();  

  const handleSaveProduct = async(values) => {
    setSavingProduct(true)
    editing ? await updateProduct(values, selectedProduct.id) : await addStock(values)
    setSavingProduct(false)
    form.resetFields()
    setActiveTabStock("1")
  };

  useEffect(()=>{
    console.log(selectedProduct)
    console.log(editing)
    if (editing && selectedProduct) {
      form.setFieldsValue({
        productName: selectedProduct.nombre,
        productPrice: selectedProduct.precio,
        productQuantity: selectedProduct.stock,
        provider: selectedProduct.id_proveedor,
        productDescription: selectedProduct.descripcion
      })
    }else{
      form.resetFields()
    }
  },[form, selectedProduct, editing])

  const fieldLabels = {
    productName: 'Nombre del producto',
    productPrice: 'Precio',
    productQuantity: "Cantidad",
    provider: 'Proveedor',
    productDescription: 'Descripción',
  };

  const openNotification = (type, label) => {
    api[type]({
      message: `Error en el campo "${label}"`,
      description: `El campo "${label}" está vacío`,
      duration: 5,
    });
  };

  const handleFinishFailed = (errorInfo) => {
    const firstError = errorInfo.errorFields[0];
    const fieldName = firstError.name[0];
    const label = fieldLabels[fieldName];
    openNotification('error', label);
  };

  

  return (
    <>
    <Form
      form={form}
      name="aniadirProducto"
      onFinish={handleSaveProduct}
      onFinishFailed={handleFinishFailed}
      style={{ maxWidth: '100%', margin: '0 auto', padding: '16px' }} 
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={20} md={14} lg={12}>
          <Form.Item
            name="productName"
            label={
              <>
                <Tag color='red'>Requerido</Tag> Nombre del Producto
              </>
            }
            rules={[{ required: true, message: 'Introduce un nombre de producto válido' }]}
          >
            <Input />
          </Form.Item>
        </Col>
  
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name="productPrice"
            label={
              <>
                <Tag color='red'>Requerido</Tag> Precio
              </>
            }
            rules={[{ required: true, message: 'Introduce un precio válido', pattern: /^[0-9]{1,}$/ }]}
          >
            <Input />
          </Form.Item>
        </Col>
  
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name="productQuantity"
            label={
              <>
                <Tag color='red'>Requerido</Tag> Stock
              </>
            }
            rules={[{ required: true, message: 'Introduce una cantidad válida' }]}
          >
            <Input />
          </Form.Item>
        </Col>
  
        <Col xs={24} sm={20} md={18} lg={12}>
          <Form.Item
            name="provider"
            label={
              <>
                <Tag color='red'>Requerido</Tag> Proveedor
              </>
            }
            rules={[{ required: true, message: 'Seleccione un proveedor' }]}
          >
            <Select
              placeholder="Seleccione un proveedor"
              style={{ width: '100%' }}
              allowClear
            >
              {processedProviders.map((item) => (
                <Option key={item.idProveedor} value={item.idProveedor}>
                  {item.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
  
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form.Item
            name="productDescription"
            label={
              <>
                <Tag color='blue'>Opcional</Tag> Descripción del producto
              </>
            }
          >
            <Input.TextArea rows={4} aria-expanded={false} autoSize={false} style={{ resize: 'none' }} />
          </Form.Item>
        </Col>
      </Row>
  
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={savingProduct}>
          Guardar Producto
        </Button>
      </Form.Item>
    </Form>
    {contextHolder}
  </>
  
  );
}

export default AddStock;
