import React, { useState } from 'react';
import { useAppContext } from '../../../utils/contexto';
import { Switch, Table, Space, message } from 'antd';

function TableCategories() {
  const { categories, toggleCategories } = useAppContext();

  const [switchDisabled, setSwitchDisabled] = useState(null)

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
  if (categories && categories.length > 0) {
    data = categories
    .slice()
    .sort((a,b)=> a.id_categoria - b.id_categoria)
    .map((category, index) => ({
      key: index.toString(),
      idCategoria: category.id_categoria,  // <-- Añadir id_categoria aquí
      nombreCategoria: category.nombre_categoria,
      descripcion: category.descripcion,
      activo: category.categoria_activa,
    }));
  }




  const paginationConfig = {
    pageSize: 5
  }

  return (
    <>
      <Table dataSource={data} pagination={paginationConfig} scroll={{ x: 800 }}>
        {/** 
       * Componente principal de la tabla.
       * `dataSource` recibe el array de datos que se va a mostrar.
       * `scroll` permite que la tabla sea desplazable horizontalmente si es necesario.
       */}

        <Table.Column
          title="Categoría"
          dataIndex="nombreCategoria"
          key="nombreCategoria"
        />
        {/**
       * `Table.Column` define cada columna de la tabla.
       * `title` es el título que se muestra en la cabecera de la columna.
       * `dataIndex` es la propiedad del objeto de datos que se va a mostrar en esta columna.
       * `key` es un identificador único para la columna, útil para React.
       */}

        <Table.Column
          title="Descripción"
          dataIndex="descripcion"
          key="descripcion"
        />
        {/** 
       * Otra columna que muestra la descripción de la categoría.
       * Similar a la anterior, con su propio `title`, `dataIndex`, y `key`.
       */}

        <Table.Column
          title="Acción" // Título de la columna
          key="accion"  // Identificador único de la columna
          render={(_, record) => (

            <Space size="middle">
              <Switch
                checked={record.activo}
                disabled={switchDisabled?.key === record.key}
                style={{ backgroundColor: record.activo ? "green" : "#cccddd" }}
                onChange={() => handleToggle(record.key, record.activo)}
              />
            </Space>
          )}
        />
        {/** 
       * Esta columna no muestra un dato directamente del objeto, sino que renderiza un componente.
       * `render` se usa para personalizar el contenido de la celda.
       * `_` ignora el primer argumento, que sería el valor de `dataIndex` (no lo necesitamos aquí).
       * `record` es el objeto completo de la fila actual.
       * Dentro de `render`, se coloca un `Switch` para activar/desactivar la categoría.
       * `checked` controla si el switch está activado basado en el campo `activo` del objeto.
       * `onChange` define lo que ocurre cuando el switch se cambia, usando la función `handleToggle`.
       */}
      </Table>
    </>
  );
}

export default TableCategories;
