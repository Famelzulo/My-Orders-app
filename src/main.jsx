import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"; // Asegúrate de que la ruta sea correcta
import "./styles/App.css"; // Asegúrate de que exista el archivo de estilos

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
