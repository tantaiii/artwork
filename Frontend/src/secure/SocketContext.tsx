import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext.tsx";

interface SocketContextType {
  socket: any | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const audioRef = useRef(new Audio("/audios/notification.mp3"));
  useEffect(() => {
    if (!user) return;

    const sock = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);

    sock.onopen = () => {
      sock.send(JSON.stringify({ type: "INIT", userId: user._id }));
      setIsConnected(true);
    };
    const handlePlayAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((err: any) => {});
      }
    };
    sock.addEventListener("message", handlePlayAudio);
    sock.onmessage = (e) => {};

    sock.onclose = () => {
      setIsConnected(false);
    };

    sock.onerror = (e) => {};

    setSocket(sock);

    return () => {
      sock.close();
      sock.removeEventListener("message", handlePlayAudio);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
