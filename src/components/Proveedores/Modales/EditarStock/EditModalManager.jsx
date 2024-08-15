import { Button, Flex, Modal } from 'antd'
import React from 'react'
import AddProviders from '../../AñadirProveedor/AddProviders'
function EditModalManager({ closeModal,selectedProvider }) {
  return (
    <>
      <Modal
        open={true}
        title="Editar proveedor"
        onCancel={closeModal}
        footer={[
          <Button type='primary' danger onClick={closeModal}>Cancelar</Button>,
        ]}
      >
        <Flex vertical >
          <AddProviders editingProvider={true} selectedProvider={selectedProvider} closeModalEditProvider={closeModal}/>
        </Flex>

      </Modal>
    </>
  )
}

export default EditModalManager