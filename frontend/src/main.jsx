import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { EntriesProvider } from "./EntriesContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <EntriesProvider>
        <App />
      </EntriesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
