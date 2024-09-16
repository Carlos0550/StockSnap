import { Button, Col, Form, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../../utils/contexto";

function AddProvider({selectedProvider, editing, idProveedor}) {
  const [form] = Form.useForm();
  const {addProvider,
 
    updateProvider
  } = useAppContext()

  const [savingProvider, setSavingProvider] = useState(false)

  useEffect(() => {
    if (editing && selectedProvider) {
      form.setFieldsValue({
        nombreProveedor: selectedProvider.nombre,
        contactoEmail: selectedProvider.email,
        contactoTelefono: selectedProvider.telefono,
        direccionCalle: selectedProvider.calle,
        postal: selectedProvider.codPostal,
        direccionCiudad: selectedProvider.ciudad,
        direccionProvincia: selectedProvider.provincia,
        cuit_cuil: selectedProvider.cuit_cuil,
        condicionIVA: selectedProvider.condicion,
        banco: selectedProvider.banco,
        numeroCuenta: selectedProvider.numeroCuenta,
        tipoCuenta: selectedProvider.tipoCuenta
      });
    } else {
      form.resetFields(); 
    }
  }, [editing, selectedProvider, form]);
  

  const saveProvider = async(values) => { 
    const providerData = JSON.stringify(values)
    setSavingProvider(true)
    const result = await editing ? updateProvider(providerData,idProveedor) : addProvider(providerData)
    setSavingProvider(false)
    if (result === 200) {
       await form.resetFields()
    }
  };
  return (
    <Form
      form={form}
      name="proveedorForm"
      onFinish={saveProvider}
      layout="vertical"
      style={{ maxWidth: '100%', margin: "0 auto" }}
    >
      <Form.Item
        name="nombreProveedor"
        label="Nombre del Proveedor"
        rules={[{ required: true, message: "Por favor ingresa el nombre del proveedor" }]}
      >
        <Input placeholder="Nombre del proveedor" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="contactoEmail"
            label="Email del Contacto"
            rules={[{ type: "email", message: "Por favor, ingrese un email válido" }]}
          >
            <Input placeholder="Email de contacto" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="contactoTelefono"
            label="Teléfono de Contacto"
            rules={[{ pattern: /^[0-9]{5,}$/, message: "Por favor, ingresa un teléfono válido" }]}
          >
            <Input placeholder="Teléfono de contacto" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="direccionCalle" label="Calle">
            <Input placeholder="Calle" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="postal"
            label="Cód. postal"
            rules={[{ pattern: /^[a-zA-Z0-9]{3,6}$/, message: "Por favor ingresa una postal válida" }]}
          >
            <Input placeholder="Código Postal" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="direccionCiudad"
            label="Ciudad"
            rules={[{ required: true, message: "Por favor ingresa la ciudad" }]}
          >
            <Input placeholder="Ciudad" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="direccionProvincia"
            label="Provincia"
            rules={[{ required: true, message: "Por favor ingresa la provincia" }]}
          >
            <Input placeholder="Provincia" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="cuit_cuil"
            label="CUIT/CUIL"
            rules={[{ required: true, message: "Por favor ingresa el CUIT/CUIL" }]}
          >
            <Input placeholder="CUIT" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="condicionIVA"
            label="Condición ante el IVA"
            rules={[{ message: "Por favor ingresa la condición ante el IVA" }]}
          >
            <Input placeholder="Condición ante el IVA" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="banco"
            label="Banco"
            rules={[{ message: "Por favor ingresa el banco" }]}
          >
            <Input placeholder="Banco" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="numeroCuenta"
            label="Número de Cuenta (CBU/CVU/ALIAS)"
            rules={[{ message: "Por favor ingresa el número de cuenta" }]}
          >
            <Input placeholder="Número de cuenta" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="tipoCuenta"
        label="Tipo de Cuenta"
        rules={[
          {
            message: "Por favor ingresa un tipo de cuenta válido",
            pattern: /^[a-zA-Z ]{3,}$/,
          },
        ]}
      >
        <Input placeholder="Tipo de cuenta" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={savingProvider}>
          Enviar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddProvider;
