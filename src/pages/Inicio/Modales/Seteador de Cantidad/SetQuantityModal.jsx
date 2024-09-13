import { message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../../utils/contexto';
import "./setQuantityModal.css"
function SetQuantityModal({ closeModal, selectedProduct }) {
  const { cart, setCart } = useAppContext();
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === '' || (Number.isInteger(Number(value)) && Number(value) > 0)) {
      setQuantity(value);
      setError('');
    } else {
      setQuantity(null)
      setError('Por favor, ingrese un número positivo válido.');
    }
  };
  // console.log(selectedProduct)
  // useEffect(()=>{
  //   console.log(cart)
  // },[cart])
  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity && !error) {
      let cloneCart = [...cart]
      const sameItem = cloneCart.find(itm => itm.idProducto === selectedProduct.idProducto)
      if (sameItem) {
        sameItem.quantity += Number(quantity)
      }else{
        cloneCart.push({...selectedProduct, quantity: Number(quantity)})
      }
      setCart(cloneCart)
      message.success("Producto añadido")
      closeModal()
    }
  };

  return (
    <>
      <Modal open={true} onCancel={closeModal} footer={[]}>
        <div className='cart__wrapper'>
          <h2>{selectedProduct.nombre}</h2>
          <form className='form__wrapper' onSubmit={handleSubmit}>
            <label htmlFor="quantity">
              Ingrese la cantidad:
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="2"
              />
            </label>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={!!error || !quantity}>Añadir al carrito</button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default SetQuantityModal;
