import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../utils/contexto';
import { Switch, Table, Space, Button, Spin, Input, Flex, message } from 'antd';
import { DeleteForever, DrawOutlined } from '@mui/icons-material';
import { AudioOutlined } from '@ant-design/icons';
import EditCategories from './Modales/EditarCategorias/EditCategories';

const { Search } = Input;

function TableCategories() {
  const { categories, products, toggleCategories, deleteCategory } = useAppContext();
  const filteredCategories = categories.filter((cat) => cat.nombre_categoria !== "categoria_eliminada" && cat.nombre_categoria !== "sin_categoria");
  const [switchDisabled, setSwitchDisabled] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [openEditCategory, setOpenEditCategory] = useState(false)

  const handleEditCategoryModal = (id_cat) =>{
    const filteredCategory = categories.find((cat)=> cat.id_categoria === id_cat) 
    setSelectedCategory(filteredCategory)
    setOpenEditCategory(true)
  }

  const handleDeleteCategory = async (id_category) => {
    const categoria_eliminada = categories.find(
      (cat) => cat.nombre_categoria === "categoria_eliminada"
    );
    const filteredProducts = products.filter(
      (cat) => cat.id_categoria === id_category
    );

    const updatedCategories = filteredProducts.map((item) => ({
      ...item,
      id_categoria: categoria_eliminada.id_categoria,
    }));

    setIsDeleting(true);
    const hiddenMessage = message.loading("Eliminando...",0)
    await deleteCategory(updatedCategories, id_category);
    hiddenMessage()
    setIsDeleting(false);

  };

  const handleToggle = async (key, checked) => {
    setSwitchDisabled({
      key: key,
      status: true,
    });
    const category = categories.find(cat => cat.id_categoria === data[key].idCategoria);
    await toggleCategories(category.id_categoria, checked);
    setSwitchDisabled({
      key: null,
      status: false,
    });
  };

  let data;
  if (filteredCategories && filteredCategories.length > 0) {
    data = filteredCategories
      .filter(category => 
        category.nombre_categoria.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => a.id_categoria - b.id_categoria)
      .map((category, index) => ({
        key: index.toString(),
        idCategoria: category.id_categoria,
        nombreCategoria: category.nombre_categoria === "sin_categoria" ? "Sin categoria" : category.nombre_categoria,
        descripcion: category.descripcion,
        activo: category.categoria_activa,
      }));
  }

  const paginationConfig = {
    pageSize: 7,
  };

  return (
    <>
      <Search
        placeholder='Buscar categorías'
        style={{marginTop: "1rem"}}
        size='large'
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table dataSource={data} pagination={paginationConfig} scroll={{ x: 500 }}>
        <Table.Column
          title="Categoría"
          dataIndex="nombreCategoria"
          key="nombreCategoria"
        />
        <Table.Column
          title="Descripción"
          dataIndex="descripcion"
          key="descripcion"
        />
        <Table.Column
          title="Acción"
          key="accion"
          render={(_, record) => (
            <Space size="middle">
              <Switch
                checked={record.activo}
                disabled={switchDisabled?.key === record.key || isDeleting}
                style={{ backgroundColor: record.activo ? "green" : "#cccddd" }}
                onChange={() => handleToggle(record.key, record.activo)}
              />
              <Flex vertical gap="small">
              <Button type='primary' danger onClick={() => handleDeleteCategory(record.idCategoria)} disabled={isDeleting}>
                {isDeleting ? <Spin /> : <DeleteForever />}
              </Button>
              <Button type='primary' onClick={()=>handleEditCategoryModal(record.idCategoria)}><DrawOutlined/></Button>
              </Flex>
            </Space>
          )}
        />
      </Table>

      {openEditCategory && <EditCategories closeModal={()=> setOpenEditCategory(false)} selectedCategory={selectedCategory} />}
    </>
  );
}

export default TableCategories;
