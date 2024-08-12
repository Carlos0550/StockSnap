#!/bin/bash

# Commit para archivos modificados
#git add package-lock.json
#git commit -m "Updated package-lock.json to reflect new dependencies"

#git add package.json
#git commit -m "Updated package.json with new scripts and dependencies"

git add src/components/GestionarStock/ManageStock.jsx
git commit -m "Se simplifico logica de filtrado, y se agrego funcionalidad de eliminar y editar stock"

git add src/components/GestionarStock/Modales/EditarStock/EditStockModal.jsx
git commit -m "Se añadio este modal para editar el stock"

git add src/components/GestionarStock/VerTodoStock/ViewStock.jsx
git commit -m "se agrego filtro para las categorias eliminadas"

git add src/components/Proveedores/A\303\261adirProveedor/AddProviders.jsx
git commit -m "componente para añadir proveedores"

git add src/components/Proveedores/Modales/ListarProveedores/ListProviders.jsx
git commit -m "Se agrego funcionalidad de eliminar proveedores"

git add src/utils/contexto.js
git commit -m "se actualizo funcionalidad para actualizar productos y se implemento funciones para eliminar stock"




echo "All commits have been made successfully."

