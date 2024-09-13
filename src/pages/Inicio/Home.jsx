import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../utils/contexto";
import { processDataSales } from "./processDataSales";
import {
  LogoutOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Statistic,
  Row,
  Col,
  Card,
  Table,
  Divider,
  Flex,
} from "antd";
import "./home.css";
import { Link, Route, Routes } from "react-router-dom";
import StockAndCategoriesManager from "../Stock y categorias/StockAndCategoriesManager";
import Search from "antd/es/transfer/search";
import SetQuantityModal from "./Modales/Seteador de Cantidad/SetQuantityModal";
import { cartSum } from "./processDataSales";
import MakeSale from "./Modales/Concretar Venta/MakeSale";
const { Header, Content } = Layout;

function Home() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { userInfo, checkSession, fetchAllResources,vistaVentas, cart, setCart } = useAppContext();
  const [searchText, setSearchText] = useState("")
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

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const processedSalesData = processDataSales(vistaVentas)
  const filteredSalesData = processedSalesData
  .filter(item => item.nombre.toLowerCase().includes(searchText.toLowerCase()))

  const [openSetterQuantityModal, setOpenSetterQuantityModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleOpenSetterQuantityModal = (idProduct) =>{
    setSelectedProduct(filteredSalesData.find(prod => prod.idProducto === idProduct))
    setOpenSetterQuantityModal(true)
  }

 const columnsTableSales = [
    {
        title: "Producto",
        key: "producto",
        dataIndex: "nombre"
    },
    {
        title: "Precio",
        key: "precio",
        dataIndex: "precio",
        render: (_,record) => (
            parseFloat(record.precio).toLocaleString("es-ES",{style: "currency", currency: "ARS"})
        )
    },
    {
        title: "Stock",
        key: "stock",
        dataIndex: "stock"
    },
    {
        title: "",
        key: "",
        render: (_,record) => (
            <>
                <Button onClick={()=>handleOpenSetterQuantityModal(record.idProducto)}><ShoppingCartOutlined/></Button>
            </>
        )
    },
]

const handleDeleteItemCart = (idx) => {
  if (idx) {
    let cloneCart = [...cart]
    const newCart = cloneCart.filter(itm => itm.idProducto !== idx)
    setCart(newCart)
  };
};

const handleAddOne = (id) =>{
  let cloneCart = [...cart]
  let itemToAdd = cloneCart.find(itm => itm.idProducto === id)
  if (itemToAdd) {
    itemToAdd.quantity += 1
  }
  setCart(cloneCart)
}

const substractOne = (id) =>{
  let cloneCart = [...cart]
  let itemToSubstract = cloneCart.find(itm => itm.idProducto === id)
  if (itemToSubstract.quantity === 1) {
    handleDeleteItemCart(id)
  }else{
    itemToSubstract.quantity -= 1
    setCart(cloneCart)
  }
}

const [openMakeSaleModal, setOpenMakeSaleModal] = useState(false)

  const renderMainComponent = () => {
    return (
      <div style={{ margin: "16px 0" }}>
        <Row gutter={[16,16]}>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <Card title="Stock para Ventas" >
              <Search
              placeholder="Buscá rápido un producto"
              onChange={(val) => setSearchText(val.target.value)}
              handleClear={()=>setSearchText("")}
              />
              <Table columns={columnsTableSales} 
              style={{marginTop: ".5rem"}} 
              dataSource={filteredSalesData} 
              className="sales__container"
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card title="Estado de Clientes">
              <Statistic
                title="Clientes con deudas vencidas"
                // value={clientDebts.overdue.length}
                style={{ marginBottom: "20px" }}
              />
              <Statistic
                title="Clientes al día"
                // value={clientDebts.upToDate}
                style={{ marginTop: "20px" }}
              />
            </Card>
            <Card title="Carrito" className="cart__container">
              {cart.map((item,index)=>(
                <>
                  <p>{item.quantity} {item.nombre}</p>
                  {""}
                  <p>${item.precio} c/u</p>
                  <Button type="primary" danger onClick={()=> handleDeleteItemCart(item.idProducto)}><DeleteOutlined /></Button> {" "} 
                  <Button danger onClick={()=> substractOne(item.idProducto)}><MinusCircleOutlined /></Button> {" "}
                  <Button type="primary" onClick={()=> handleAddOne(item.idProducto)}><PlusCircleOutlined /></Button>
                  <div className="divider"></div>
                </>
              ))}
              <h2>Total: ${cartSum(cart).toLocaleString("es-ES")}</h2>
              <Flex gap="small" vertical>
                <Button onClick={()=>setOpenMakeSaleModal(true)}>Concretar venta</Button>
                <Button>Borrar carrito</Button>
              </Flex>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Layout>
      <Header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          className="menu__desktop"
        >
          <Menu.Item key="1" className="manu__item">
            <Link to="">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2" className="manu__item">
            <Link to="stock&categories">Stock y categorías</Link>
          </Menu.Item>
          <Menu.Item key="3" className="manu__item">
            <Link to="providers">Proveedores</Link>
          </Menu.Item>
          <Menu.Item key="4" className="manu__item">
            <Link to="sales">Ventas</Link>
          </Menu.Item>
          <Menu.Item key="5" className="manu__item">
            <Link to="more-options">Más opciones</Link>
          </Menu.Item>
        </Menu>

        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          className="hamburguer__icon"
        />

        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          className="btn__closeSession-desktop"
        >
          Cerrar sesión
        </Button>
      </Header>

      <Drawer
        title="Menú"
        placement="left"
        closable={true}
        onClose={onClose}
        visible={drawerVisible}
      >
        <Menu theme="ligth" mode="vertical" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" className="manu__item">
            <Link to="">Inicio</Link> 
          </Menu.Item>
          <Menu.Item key="2" className="manu__item">
            <Link to="stock&categories">Stock y categorías</Link>
          </Menu.Item>
          <Menu.Item key="3" className="manu__item">
            <Link to="providers">Proveedores</Link>
          </Menu.Item>
          <Menu.Item key="4" className="manu__item">
            <Link to="sales">Ventas</Link>
          </Menu.Item>
          <Menu.Item key="5" className="manu__item">
            <Link to="more-options">Más opciones</Link>
          </Menu.Item>
        </Menu>
      </Drawer>

      <Content style={{ padding: "0 50px" }}>
        <Routes>
          <Route path="/" element={renderMainComponent()} /> 
          <Route path="stock&categories" element={<StockAndCategoriesManager />} />
        </Routes>
      </Content>
      {openSetterQuantityModal && <SetQuantityModal closeModal={()=> setOpenSetterQuantityModal(false)} selectedProduct={selectedProduct}/>}
      {openMakeSaleModal && <MakeSale closeModal={()=> setOpenMakeSaleModal(false)}/>}
    </Layout>
  );
}

export default Home;
