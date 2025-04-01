import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AddEditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order , setOrder] = useState({
        orderNumber: "",
        date: new Date().toISOString().split("T")[0],
        products: [],
        finalPrice :0,


    });

    const availableProducts = [
        { id: 1, name: "Product A", price: 50 },
        { id: 2, name: "Product B", price: 100 },
        { id: 3, name: "Product C", price: 75 },
    ];

    useEffect(() =>{
        if (id) {
//cargar pedido con API
            const existingOrder = {
                orderNumber: "ORD00" + id,
        date: "2025-04-01",
        products: [
          { id: 1, name: "Product A", price: 50, quantity: 2 },
          { id: 2, name: "Product A", price: 50, quantity: 2 },
          { id: 1, name: "Product A", price: 50, quantity: 2 },
             
        ],
        finalPrice: 100,

            };

            setOrder(existingOrder);
        }
    
    }, [id]);

    const removeProduct = (productId) => {
        setOrder(prev => {
            const newProducts = prev.products.filter(p => p.id !== productId);
            const newFinalPrice = newProducts.reduce((sum, p) => sum + p.price * p.quantity, 0); // Usando `price * quantity`
            return { ...prev, products: newProducts, finalPrice: newFinalPrice };
        });
    };
    
      // Guardar pedido (simulación)
      const saveOrder = () => {
        alert(`Order ${id ? "Updated" : "Created"} Successfully!`);
        navigate("/my-orders"); // Redirigir a la lista de pedidos
      };


      const addProduct = (productId) => {
        const product = availableProducts.find(p => p.id === productId);
        if (product) {
            setOrder(prev => {
                const newProducts = [...prev.products, { ...product, quantity: 1 }]; // Agregar el producto con cantidad 1 por defecto
                const newFinalPrice = newProducts.reduce((sum, p) => sum + p.price * p.quantity, 0); // Actualizar precio total
                return { ...prev, products: newProducts, finalPrice: newFinalPrice };
            });
        }
    };
    
    
      return (
        <div className="container">
          <h1>{id ? "Edit Order" : "Add Order"}</h1>
          
          <form>
            <label>Order #</label>
            <input type="text" value={order.orderNumber} readOnly />
    
            <label>Date</label>
            <input type="date" value={order.date} readOnly />
    
            <label># Products</label>
            <input type="text" value={order.products.length} readOnly />
    
            <label>Final Price</label>
            <input type="text" value={`$${order.finalPrice}`} readOnly />
          </form>
    
          <h3>Add Product</h3>
          <select onChange={(e) => addProduct(e.target.value)}>
            <option value="">Select a Product</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
            ))}
          </select>
    
          <h3>Products in Order</h3>
          <table border="1">
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
              {order.products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.quantity}</td>
                  <td>${p.total}</td>
                  <td>
                    <button onClick={() => removeProduct(p.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
          <button onClick={saveOrder}>Save Order</button>
        </div>
      );

};





export default AddEditOrder;