import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Table, Typography, Switch, Tag, Tooltip } from 'antd';
import { useAppContext } from '../../../utils/contexto';
import dayjs from 'dayjs';
import fetchAllDeliveriesClients from './FetchDelivers';
import Search from 'antd/es/transfer/search';
const { Title } = Typography;

export default function AnaliticsDashboard() {
  const { clients, debts } = useAppContext();
  const [delivers, setDelivers] = useState([])
  const [searchText, setSearchText] = useState("")
  const parseContact = (contact) => {
    try {
      return JSON.parse(contact);
    } catch (e) {
      return { direccion: '', telefono: '' };
    }
  };

  const alreadyFetch = useRef(false)
  useEffect(() => {
    const fetchData = async () => {
      if (!alreadyFetch.current) {
        const result = await fetchAllDeliveriesClients();
        if (result) {
          setDelivers(result);
        }
        alreadyFetch.current = true;
      }
    };

    fetchData();
  }, []);

  const parseDeliversDate = (entregas) => {
    try {
      let parsedEntregas = JSON.parse(entregas);
      return parsedEntregas.fecha_entrega;
    } catch (e) {
      return null;
    }
  }

  const parseDelivers = (entregas) => {
    try {
      let parsedEntregas = JSON.parse(entregas);
      return parseInt(parsedEntregas.monto);
    } catch (error) {
      return null;
    }
  }
  
  const getClientsData = () => {
    return clients?.data?.map(client => {
      // Filtrar todas las deudas del cliente
      const clientDebts = debts?.filter(debt => debt.id_cliente === client.id_cliente) || [];
  
      // Filtrar las entregas del cliente
      const deliversClients = delivers.filter(deliv => deliv.id_cliente === client.id_cliente);
  
      // Obtener la última fecha de entrega
      const latestDeliveryDate = deliversClients.reduce((latest, current) => {
        const parsedDate = parseDeliversDate(current.entregas);
        const currentDate = dayjs(parsedDate);
        return currentDate.isValid() && (!latest || currentDate.isAfter(dayjs(latest))) ? currentDate : latest;
      }, null);
  
      // Obtener la acumulación de entregas
      const totalDeliveries = deliversClients.reduce((acc, item) => {
        const parsedMonto = parseDelivers(item.entregas);
        return acc + (parsedMonto || 0);
      }, 0);
  
      // Encontrar la fecha de deuda más antigua
      const oldestDebt = clientDebts.reduce((oldest, current) => {
        const currentDate = dayjs(current.fecha_deuda);
        return currentDate.isValid() && (!oldest || currentDate.isBefore(dayjs(oldest.fecha_deuda))) ? current : oldest;
      }, null);
  
      // Determinar el total de deuda
      const totalDebt = clientDebts.reduce((sum, debt) => sum + debt.total_adeudado, 0);
  
      // Determinar el estado del cliente basado en la última entrega
      let status;
      if (latestDeliveryDate) {
        const daysSinceLastDelivery = dayjs().diff(latestDeliveryDate, 'day');
        status = daysSinceLastDelivery > 30 ? 'Deudor' : 'Al día';
      } else {
        const daysSinceOldestDebt = oldestDebt ? dayjs().diff(dayjs(oldestDebt.fecha_deuda), 'day') : null;
        status = totalDebt > 0 && daysSinceOldestDebt > 30 ? 'Deudor' : 'Al día';
      }
  
      return {
        key: client.id_cliente,
        name: client.nombre_completo,
        debt: totalDebt - totalDeliveries,
        lastPurchase: oldestDebt?.fecha_deuda ? dayjs(oldestDebt.fecha_deuda).format('YYYY-MM-DD') : 'N/A',
        lastDelivery: latestDeliveryDate && dayjs(latestDeliveryDate).isValid() ? dayjs(latestDeliveryDate).format('YYYY-MM-DD') : 'N/A',
        status,
        contact: parseContact(client.contacto),
      };
    });
  };
  

  const formatDate = (date) => {
    return date !== "" ? dayjs(date).format('DD/MM/YYYY') : 'N/A';
  };

  const filteredClients = getClientsData().filter(client =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Deuda',
      dataIndex: 'debt',
      key: 'debt',
      render: (debt) => `$${debt.toLocaleString("es-ES", { style: "currency", currency: "ARS" })}`,
      sorter: (a, b) => a.debt - b.debt,
    },
    {
      title: 'Última Deuda',
      dataIndex: 'lastPurchase',
      key: 'lastPurchase',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.lastPurchase) - new Date(b.lastPurchase),
    },
    {
      title: "Ultima entrega",
      dataIndex: "lastDelivery",
      key: "lastDeliver"
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tooltip title={status === 'Deudor' ? 'El cliente tiene deuda pendiente' : 'El cliente está al día'}>
          <Tag color={status === 'Deudor' ? 'red' : 'green'}>
            {status}
          </Tag>
        </Tooltip>
      ),
      sorter: (a, b) => {
        const order = { 'Deudor': 1, 'Al día': 2 };
        return order[a.status] - order[b.status];
      },
    },
    {
      title: 'Contacto',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact) => (
        <div>
          <p>Dirección: {contact.direccion || 'N/A'}</p>
          <p>Teléfono: {contact.telefono || 'N/A'}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>Análisis de Clientes</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Todos los clientes"
            extra={(
              <Search
              onChange={(e)=> setSearchText(e.target.value)}
              placeholder='Busca un cliente especifico'
              
              />
            )}
          >
            <Table
              dataSource={filteredClients}
              columns={columns}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 500 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
