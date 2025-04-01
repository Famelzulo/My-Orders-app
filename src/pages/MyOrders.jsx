import { useEffect , useState } from "react";
import { Link } from "react-router-dom";
import api  from "../components/api"

const MyOrders = () => {
   const [orders , setOrders] = useState([
        {id: 1, orderNumber:"ORD001", date:"2025-04-01", products: 1, price:50},
        {id:2, orderNumber:"ORD002", date:"2025-04-01", products: 2, price:100 },
        {id:3, orderNumber:"ORD003", date:"2025-04-01", products: 3, price:75 },

    ]);
    const [order, setOrder] = useState({
      orderNumber: "",
      date: new Date().toISOString().split("T")[0], // Fecha actual (YYYY-MM-DD)
      products: [],
      finalPrice: 0,
  });
  

    const deleteOrder =(id) => {
        const confirmDelete = window.confirm("Are you sure you want delete this order?");
        if (confirmDelete) {
            setOrders(orders.filter(order => order.id !== id));
        }
    };

    //const [orders, setOrders] = useState([]);
   // const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const data = await api.getOrders();
          console.log("Fetched orders:", data); // Verifica los datos
          setOrders(data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      };
    
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
                  <td>{order.orderNumber}</td>
                  <td>{order.date}</td>
                  <td>{order.products}</td>
                  <td>${order.price}</td>
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