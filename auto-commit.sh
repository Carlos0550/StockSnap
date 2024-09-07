#!/bin/bash

# Commit para archivos modificados
#git add package-lock.json
#git commit -m "Updated package-lock.json to reflect new dependencies"

#git add package.json
#git commit -m "Updated package.json with new scripts and dependencies"

git add "src/components/Proveedores/A\303\261adirProveedor/AddProviders.jsx"
git commit -m "se reutilizo este componente para actualizar los proveedores"

git add src/components/Proveedores/ManageProviders.jsx
git commit -m "ajuste para enviar datos necesarios a AddProviders"

git add src/components/Proveedores/Modales/ListarProveedores/ListProviders.jsx
git commit -m "Logica actualizada para eliminar y actualizar proveedores"

git add src/pages/Home/Home.jsx
git commit -m "ajustes de estilos"

git add src/pages/Home/home.css
git commit -m "ajustes de estilos"

git add src/utils/contexto.js
git commit -m "Ajuste de logica para actualizar proveedores"

echo "All commits have been made successfully."

