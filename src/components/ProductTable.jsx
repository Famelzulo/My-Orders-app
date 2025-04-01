import React, { useState } from 'react';

const ProductTable = ({ products, onAddProduct }) => {
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ id: '', qty: 0 });

  const handleAddProduct = () => {
    onAddProduct({ id: newProduct.id, qty: newProduct.qty });
    setProductModalOpen(false);
  };

  return (
    <div>
      <h3>Available Products</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Total Price</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.unitPrice}</td>
              <td>{product.qty}</td>
              <td>{product.qty * product.unitPrice}</td>
              <td>
                <button>Edit Product</button>
                <button>Remove Product</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setProductModalOpen(true)}>Add Product</button>

      {productModalOpen && (
        <div>
          <h3>Select Product</h3>
          <input 
            type="text" 
            value={newProduct.id}
            onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
            placeholder="Product ID" 
          />
          <input 
            type="number" 
            value={newProduct.qty}
            onChange={(e) => setNewProduct({ ...newProduct, qty: parseInt(e.target.value) })}
            placeholder="Quantity" 
          />
          <button onClick={handleAddProduct}>Add</button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
