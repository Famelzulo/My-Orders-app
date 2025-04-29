import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import api from "../components/api";
import "../styles/MyOrders.css";
import "../styles/AddEditOrder.css";

const AddEditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    orderNumber: "",
    id: 0,
    date: new Date().toISOString().split("T")[0],
    products: [],
    quantity: 0,
    price: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available products
        const products = await api.getProducts();
        setAvailableProducts(products);

        // If there's an ID, fetch the order
        if (id) {
          const orderData = await api.getOrderById(id);
          if (!orderData) {
            throw new Error("Order not found");
          }

          setOrder({
            orderNumber: `ORD00${orderData.id}`,
            id: orderData.id,
            date: new Date(orderData.date).toISOString().split("T")[0],
            products: orderData.order_products?.map(op => ({
              id: op.product_id,
              name: products.find(p => p.id === op.product_id)?.name || '',
              price: op.price,
              quantity: op.quantity
            })) || [],
            quantity: orderData.quantity,
            price: orderData.price
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading order data. Please try again.");
        navigate("/my-orders");
      }
    };

    fetchData();
  }, [id, navigate]);

  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setProductQuantity(product ? product.quantity : 1);
    setIsModalOpen(true);
  };

  const addOrUpdateProduct = () => {
    if (order.products.length >= 3) {
      alert("You can only add a maximum of 3 products per order.");
      return;
    }

    if (selectedProduct) {
      // Update existing product
      setOrder((prev) => {
        const updatedProducts = prev.products.map((p) =>
          p.id === selectedProduct.id ? { ...p, quantity: parseInt(productQuantity) } : p
        );
        return {
          ...prev,
          products: updatedProducts,
          quantity: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
          price: calculateTotal(updatedProducts),
        };
      });
    } else {
      // Add new product
      const product = availableProducts.find(
        (p) => p.id === parseInt(selectedProductId)
      );
      if (product) {
        setOrder((prev) => {
          const newProducts = [...prev.products, { ...product, quantity: parseInt(productQuantity) }];
          return {
            ...prev,
            products: newProducts,
            quantity: newProducts.reduce((sum, p) => sum + p.quantity, 0),
            price: calculateTotal(newProducts),
          };
        });
      }
    }
    setIsModalOpen(false);
    setSelectedProductId("");
  };

  const calculateTotal = (products) =>
    products.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);

  const removeProduct = (productId) => {
    setOrder((prev) => {
      const newProducts = prev.products.filter((p) => p.id !== productId);
      return {
        ...prev,
        products: newProducts,
        quantity: newProducts.reduce((sum, p) => sum + p.quantity, 0),
        price: calculateTotal(newProducts),
      };
    });
  };

  const saveOrder = async () => {
    if (order.products.length > 3) {
      alert("You can only add a maximum of 3 products per order.");
      return;
    }

    try {
      // Ensure we don't have duplicate products
      const uniqueProducts = order.products.reduce((acc, current) => {
        const existingProduct = acc.find(p => p.product_id === current.id);
        if (existingProduct) {
          existingProduct.quantity += current.quantity;
        } else {
          acc.push({
            product_id: current.id,
            quantity: current.quantity,
            price: current.price
          });
        }
        return acc;
      }, []);

      const orderData = {
        quantity: uniqueProducts.reduce((sum, p) => sum + p.quantity, 0),
        price: order.price,
        order_products: uniqueProducts
      };

      if (id) {
        await api.updateOrder(id, orderData);
      } else {
        await api.createOrder(orderData);
      }

      alert(`Order ${id ? "Updated" : "Created"} Successfully!`);
      navigate("/my-orders");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order. Please try again.");
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
        <input type="text" value={order.quantity} readOnly />
        <label>Final Price</label>
        <input type="text" value={`$ ${order.price.toFixed(2)}`} readOnly />
      </form>
      <button onClick={() => openProductModal()} className="add-product-button">+ Add Product</button>
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
          {order.products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.quantity}</td>
              <td>${(p.price * p.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => openProductModal(p)} className="edit-button">✏️ Edit</button>
                <button onClick={() => removeProduct(p.id)} className="remove-button">❌ Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveOrder} className="save-order-button">Save Order</button>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>{selectedProduct ? "Edit Product" : "Add Product"}</h2>
        {!selectedProduct && (
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">Select a Product</option>
            {availableProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - ${p.price.toFixed(2)}
              </option>
            ))}
          </select>
        )}
        <label>Quantity</label>
        <input
          type="number"
          min="1"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
        />
        <button
          onClick={addOrUpdateProduct}
          disabled={!selectedProduct && !selectedProductId}
        >
          {selectedProduct ? "Update" : "Add"}
        </button>
      </Modal>
    </div>
  );
};

export default AddEditOrder;
