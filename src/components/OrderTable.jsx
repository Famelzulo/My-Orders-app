function OrderTable ({ orders }) {
    return (
        <table border= "1" width= "100%">
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
            {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.orderNumber}</td>
            <td>{order.date}</td>
            <td>{order.numProducts}</td>
            <td>${order.finalPrice}</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
            </tbody>
        </table>
    )
}

export default OrderTable;