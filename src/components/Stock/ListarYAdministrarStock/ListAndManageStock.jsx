import React, { useState } from 'react'
import { useAppContext } from '../../../utils/contexto'
import { Button, Table, Input, Flex, Popconfirm, Select } from 'antd';
import { DeleteOutline, Draw } from '@mui/icons-material';
import EditStockModal from '../Modales/EditarStock/EditStockModal';
const {Option} = Select;
const { Search } = Input
function ListAndManageStock() {
  const { products, deleteProduct,proveedores, categories } = useAppContext()
  const [EditModalState, setEditModalState] = useState(false)
  const [selectedStock, setSelectedStock] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const [searchText, setSearchText] = useState('')
  const toggleModalEdit = (key) => {
    setSelectedStock(products.find((prod) => prod.id_producto === key))
    setEditModalState(!EditModalState)
  }
  const [idDeleting, setIsDeleting] = useState(false)
  const handleDeleteProduct = async (id) => {
    setIsDeleting(true)
    await deleteProduct(id)
    setIsDeleting(false)
  }

  // const formatProviderText = (text) =>{
  //   const formatText = text.split("_").map((word)=>{
  //     return word.charAt(0).toUpperCase() + word.slice(1)
  //   })

  //   return formatText.join(" ")
  // }
  let data;

  if (products && products.length > 0) {
    data = products
      .slice()
      .filter(prod => {
        //por nombre de producto
        const matchedSearchText = prod.nombre_producto.toLowerCase().includes(searchText.toLowerCase())

        //por categoria
        const matchedCategory = selectedCategory ? prod.id_categoria === selectedCategory : true

        // por proveedor

        const matchedProvider = selectedProveedor ? prod.id_proveedor === selectedProveedor : true

        return matchedSearchText && matchedProvider && matchedCategory
      })
      .sort((a, b) => a.id_producto - b.id_producto)
      .map((product, index) => ({
        key: index.toString(),
        id_producto: product.id_producto,
        proveedor: product.nombre_proveedor === "proveedor_eliminado" ? "Proveedor desvinculado" : product.nombre_proveedor === "sin_proveedor" ? "Sin proveedor" : product.nombre_proveedor,
        categoria: product.nombre_categoria === "categoria_eliminada" ? "Categoria desvinculada" : product.nombre_categoria === "sin_categoria" ? "Sin categoria" : product.nombre_categoria,
        nombre_producto: product.nombre_producto,
        precio: product.precio_unitario.toLocaleString("es-ES", { style: "currency", currency: "ARS" }),
        stock: product.stock
      }))
  }

  const paginationConfig = {
    pageSize: 7
  }


  return (
    <>

      <div className="tableStock__container">
        <Search
          placeholder="Buscar un producto"
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginTop: "2rem" }}
        />

        <Flex gap={"middle"} style={{margin: "1rem"}}>
          Filtrar por proveedor
          <Select
            style={{ width: "200px" }}
            onChange={(value) => setSelectedProveedor(value)}
            placeholder="Selecciona un proveedor"
          >
            <Option value={null}>Todos los proveedores</Option>
            {proveedores.map((prov) => (
              <Option key={prov.id_proveedor} value={prov.id_proveedor}>
                {prov.nombre_proveedor === "proveedor_eliminado" ? "Proveedores desvinculados/eliminados" : prov.nombre_proveedor === "sin_proveedor" ? "Sin proveedor" : prov.nombre_proveedor}
              </Option>
            ))}
          </Select>
          Filtrar por categoría
          <Select
            style={{ width: "200px" }}
            onChange={(value) => setSelectedCategory(value)}
            placeholder="Seleccionar categoría"
          >
            <Option value={null}>Todas las categorias</Option>
            {categories.map((cat) => (
              <Option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre_categoria === "categoria_eliminada" ? "Categorias desvinculados/eliminados" : cat.nombre_categoria === "sin_categoria" ? "Sin categoria" : cat.nombre_categoria}
              </Option>
            ))}
          </Select>
        </Flex>
        <Table dataSource={data} pagination={paginationConfig} scroll={{ x: 500 }}>

          <Table.Column
            title="Nombre producto"
            dataIndex="nombre_producto"
            key="nombre_producto"
          />

          <Table.Column
            title="Stock disponible"
            dataIndex="stock"
            key="stock"
          />

          <Table.Column
            title="Precio unitario"
            dataIndex="precio"
            key="precio"
          />

          <Table.Column
            title="Categoria"
            dataIndex="categoria"
            key="categoria"
          />

          <Table.Column
            title="Proveedor"
            dataIndex="proveedor"
            key="proveedor"
          />

          <Table.Column
            title=""
            key="accion"
            render={(_, record) => (
              <Flex gap="middle" wrap justify='center' align='center'>
                <Popconfirm
                  cancelText="Cancelar"
                  okText="Eliminar"
                  okType='danger'
                  title="¿Está seguro de eliminar este producto?"
                  description="Hacerlo lo eliminará definitivamente"
                  onConfirm={() => handleDeleteProduct(record.id_producto)}
                >
                  <Button type='primary' danger disabled={idDeleting}><DeleteOutline /></Button>

                </Popconfirm>
                <Button onClick={() => toggleModalEdit(record.id_producto)} disabled={idDeleting}><Draw /></Button>
              </Flex>

            )}
          />
        </Table>
      </div>

      {EditModalState && <EditStockModal closeModal={() => toggleModalEdit()} selectedStock={selectedStock} />}
    </>
  )
}

export default ListAndManageStock