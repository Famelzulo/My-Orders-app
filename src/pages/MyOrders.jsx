import { useEffect , useState } from "react";
import { Link } from "react-router-dom";
import api  from "../components/api"

const MyOrders = () => {
   const [orders , setOrders] = useState([]);
   
  

   const deleteOrder = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
        // Eliminar la orden de localStorage y actualizar el estado
        const updatedOrders = orders.filter(order => order.id !== id);
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders)); // Guardar cambios en localStorage
    }
};

    
useEffect(() => {
  // Cargar las órdenes desde localStorage al iniciar
  const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

  const filteredOrders = storedOrders.filter(order => order.products.length <= 3);

  // Calcular el precio final para cada orden
  const updatedOrders = filteredOrders.map(order => {
      const finalPrice = order.products.reduce((total, product) => total + product.price, 0);
      return { ...order, finalPrice }; // Añadir el precio final a cada orden
  });

  setOrders(updatedOrders);
}, []);

    
    

    return (
        <div className="container">
          <h1>My Orders</h1>
          <button>
            <Link to="/add-order">+ Add New Order</Link>
          </button>
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order #</th>
                <th>Date</th>
                <th># Products</th>
                <th>Final Price</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.orderNumber}</td>
                  <td>{order.date}</td>
                  <td>{order.products ? order.products.reduce((total, product) => total + (product?.quantity || 0), 0) : 0}</td>
                  <td>${order.products ? order.products.reduce((total, product) => total + ((product?.price || 0) * (product?.quantity || 0)), 0) : 0}</td>
                  <td>
                    <Link to={`/add-order/${order.id}`}className="edit-link">Edit</Link>
                    <button onClick={() => deleteOrder(order.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

export default MyOrders;