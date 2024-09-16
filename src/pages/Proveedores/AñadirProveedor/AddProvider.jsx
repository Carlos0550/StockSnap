import { Button, Col, Form, Input, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../utils/contexto";

function AddProvider({ selectedProvider, editing, idProveedor }) {
  const [form] = Form.useForm();
  const { addProvider, setActiveTabProviders, updateProvider } = useAppContext();
  const [api, contextHolder] = notification.useNotification();
  const [savingProvider, setSavingProvider] = useState(false);

  const fieldLabels = {
    nombreProveedor: "Nombre del Proveedor",
    direccionCiudad: "Ciudad",
    direccionProvincia: "Provincia",

  };

  const openNotificationWithIcon = (type, label) => {
    api[type]({
      message: `Error en el campo: ${label}`,
      description: `El campo "${label}" está vacío o no es válido. Por favor, verifica la información.`,
    });
  };

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
        tipoCuenta: selectedProvider.tipoCuenta,
      });
    } else {
      form.resetFields();
    }
  }, [editing, selectedProvider, form]);

  const saveProvider = async (values) => {
    const providerData = JSON.stringify(values);
    setSavingProvider(true);
    editing
      ? await updateProvider(providerData, idProveedor)
      : await addProvider(providerData);
    setSavingProvider(false);
    form.resetFields();
    setActiveTabProviders("1");
  };

  const handleFinishFailed = (errorInfo) => {
    const firstError = errorInfo.errorFields[0]; // Toma el primer error
    const fieldName = firstError.name[0]; // Obtiene el nombre del campo que falló
    const label = fieldLabels[fieldName]; // Usa el objeto fieldLabels para obtener el label correspondiente
    openNotificationWithIcon("error", label);
  };

  return (
    <>
      <Form
        form={form}
        name="proveedorForm"
        onFinish={saveProvider}
        layout="vertical"
        onFinishFailed={handleFinishFailed}
        style={{ maxWidth: "100%", margin: "0 auto" }}
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
              label="Email"
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

        <h3>Información adicional (Opcional)</h3>
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

        <h3>Información Fiscal (Opcional)</h3>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="cuit_cuil" label="CUIT/CUIL">
              <Input placeholder="CUIT" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="condicionIVA"
              label="Condición ante el IVA"
            >
              <Input placeholder="Condición ante el IVA" />
            </Form.Item>
          </Col>
        </Row>

        <h3>Información Bancaria (Opcional)</h3>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="banco" label="Banco">
              <Input placeholder="Banco" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="numeroCuenta"
              label="Número de Cuenta (CBU/CVU/ALIAS)"
            >
              <Input placeholder="Número de cuenta" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="tipoCuenta"
          label="Tipo de Cuenta"
          rules={[
            { pattern: /^[a-zA-Z ]{3,}$/, message: "Por favor ingresa un tipo de cuenta válido" },
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
      {contextHolder}
    </>
  );
}

export default AddProvider;
