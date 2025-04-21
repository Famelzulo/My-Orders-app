import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../components/api"

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      console.log("Fetched orders:", data);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const data = await api.deleteOrder(id);
      console.log("Fetched delete:", data);

      // Update the orders and filter teh delete order
      
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Error deleting order. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
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
              <td>ORD00{order.id}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.quantity}</td>
              
              <td>${order.price.toFixed(2)}</td>

              <td>
                <Link to={`/add-order/${order.id}`} className="edit-link">Edit</Link>
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
