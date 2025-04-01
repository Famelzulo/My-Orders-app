import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";

const AddEditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    orderNumber: "",
    date: new Date().toISOString().split("T")[0],
    products: [],
    finalPrice: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);

  const availableProducts = [
    { id: 1, name: "Product A", price: 50 },
    { id: 2, name: "Product B", price: 100 },
    { id: 3, name: "Product C", price: 75 },
  ];

  useEffect(() => {
    if (id) {
      const existingOrder = {
        orderNumber: "ORD00" + id,
        date: "2025-04-01",
        products: [
          { id: 1, name: "Product A", price: 50, quantity: 2 },
          { id: 2, name: "Product B", price: 100, quantity: 2 },
          { id: 3, name: "Product C", price: 75, quantity: 2 },
        ],
        finalPrice: 200,
      };
      setOrder(existingOrder);
    }
  }, [id]);

  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setProductQuantity(product ? product.quantity : 1);
    setIsModalOpen(true);
  };

  const addOrUpdateProduct = () => {
    // Verificar si ya hay 3 productos en la orden
    if (order.products.length >= 3) {
      return; // Detener la adición si ya hay 3 productos
    }

    if (selectedProduct) {
      // Si se está editando un producto existente
      setOrder((prev) => {
        const updatedProducts = prev.products.map((p) =>
          p.id === selectedProduct.id ? { ...p, quantity: productQuantity } : p
        );
        return {
          ...prev,
          products: updatedProducts,
          finalPrice: calculateTotal(updatedProducts),
        };
      });
    } else {
      // Si se está agregando un nuevo producto
      const product = availableProducts.find(
        (p) => p.id === parseInt(productQuantity)
      );
      if (product) {
        setOrder((prev) => {
          const newProducts = [...prev.products, { ...product, quantity: 1 }];
          return {
            ...prev,
            products: newProducts,
            finalPrice: calculateTotal(newProducts),
          };
        });
      }
    }
    setIsModalOpen(false);
  };

  const calculateTotal = (products) =>
    products.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);

  const removeProduct = (productId) => {
    setOrder((prev) => {
      const newProducts = prev.products.filter((p) => p.id !== productId);
      const updatedFinalprice = calculateTotal(newProducts);
      return { ...prev, products: newProducts, finalPrice: updatedFinalprice };
    });
  };

  const saveOrder = () => {
    // Validar que no haya más de 3 productos
    if (order.products.length > 3) {
      alert("You can only add a maximum of 3 products per order.");
      return; // No guardar la orden si hay más de 3 productos
    }

    // Si no hay más de 3 productos, continuar con el proceso de guardado
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: id ? parseInt(id) : existingOrders.length + 1, // Si es edición, mantener ID
      orderNumber: order.orderNumber || `ORD00${existingOrders.length + 1}`,
      date: order.date,
      products: order.products,
      finalPrice: order.finalPrice,
    };

    if (id) {
      // Si es edición, reemplazar la orden existente
      const updatedOrders = existingOrders.map((o) =>
        o.id === newOrder.id ? newOrder : o
      );
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
    } else {
      // Si es una nueva orden, agregarla a la lista
      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, newOrder])
      );
    }

    alert(`Order ${id ? "Updated" : "Created"} Successfully!`);
    navigate("/my-orders"); // Redirigir a la vista de las órdenes
  };

  

  const deleteOrder = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      const updatedOrders = orders.filter((order) => order.id !== id);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders)); // Guardar en localStorage
    }
  };

  const confirmSave = () => {
    setIsConfirmModalOpen(false);
    alert(`Order ${id ? "Updated" : "Created"} Successfully!`);
    navigate("/my-orders");
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
      <button onClick={() => openProductModal()}>Add Product</button>
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
              <td>${p.price}</td>
              <td>{p.quantity}</td>
              <td>${p.price * p.quantity}</td>
              <td>
                <button onClick={() => openProductModal(p)}>✏️ Edit</button>
                <button onClick={() => removeProduct(p.id)}>❌ Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveOrder}>Save Order</button>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>{selectedProduct ? "Edit Product" : "Add Product"}</h2>
        {!selectedProduct && (
          <select onChange={(e) => setProductQuantity(e.target.value)}>
            <option value="">Select a Product</option>
            {availableProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - ${p.price}
              </option>
            ))}
          </select>
        )}
        <label>Quantity</label>
        <input
          type="number"
          min="1"
          value={productQuantity}
          onChange={(e) => setProductQuantity(parseInt(e.target.value))}
        />
        <button onClick={addOrUpdateProduct}>
          {selectedProduct ? "Update" : "Add"}
        </button>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
      >
        <h2>Confirm Order</h2>
        <p>Are you sure you want to save this order?</p>
        <button onClick={confirmSave}>Yes</button>
        <button onClick={() => setIsConfirmModalOpen(false)}>No</button>
      </Modal>
    </div>
  );
};

export default AddEditOrder;
