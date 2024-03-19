// import React, { createContext, useContext, useEffect, useState } from 'react';

// const WebSocketContext = createContext(null);


// export const WebSocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const socketUrl = process.env.REACT_APP_SOCKET

//   useEffect(() => {
//     const newSocket = new WebSocket(socketUrl);

//     newSocket.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     newSocket.onclose = () => {
//       console.log('WebSocket disconnected');
//     };

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   return (
//     <WebSocketContext.Provider value={socket}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// }

// export const useWebSocket = () => {
//   return useContext(WebSocketContext);
// };