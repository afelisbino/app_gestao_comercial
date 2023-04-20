import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Bootstrap CSS
import "./assets/scss/bootstrap.scss";

// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
