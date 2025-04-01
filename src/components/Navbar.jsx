import { Link } from "react-router-dom";


function Navbar () {
    return (
        <nav style={{padding: "10px", background: "#f4f4f4"}}>
            <Link to="/my-orders" style={{ marginRight: "10px" }}>My Orders</Link>
            <Link to="/add-order">Add Order</Link>
            </nav>
    );
}

export default Navbar;