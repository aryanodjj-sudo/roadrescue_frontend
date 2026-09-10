import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

// VITE_API_URL is like "http://localhost:5000/api" — Socket.IO connects
// to the server root, not the /api path, so strip it off.
const SOCKET_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("roadrescue_token");

    if (!isAuthenticated || !token) {
      setSocket(null);
      return;
    }

    const instance = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    setSocket(instance);

    return () => {
      instance.disconnect();
    };
    // Re-connect whenever auth state flips (login/logout), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

// Returns the active socket, or null if not connected yet/logged out.
// Consumers must null-check before calling .emit()/.on().
export function useSocket() {
  return useContext(SocketContext);
}