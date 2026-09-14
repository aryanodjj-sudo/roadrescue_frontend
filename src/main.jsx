import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { VehicleProvider } from "./context/VehicleContext.jsx";
import { SubscriptionProvider } from "./context/SubscriptionContext.jsx";
import { ServiceRequestProvider } from "./context/ServiceRequestContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <VehicleProvider>
            <ServiceRequestProvider>
              <SubscriptionProvider>
                <App />
              </SubscriptionProvider>
            </ServiceRequestProvider>
          </VehicleProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);