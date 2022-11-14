import { createContext, useEffect, useState } from "react"
import useAuth from "./hooks/useAuth"
import io from "socket.io-client"

const SocketContext = createContext()

function SocketProvider(props) {
    const [socket, setSocket] = useState(null)
    const { auth } = useAuth()

    useEffect(() => {
        if (auth.isLoggedIn === true) {
            setSocket(io.connect(process.env.REACT_APP_SOCKET_URL, {
                'reconnection': true,
                'reconnectionDelay': 500,
                'reconnectionAttempts': 10,
                query: {
                    userName: auth?.user?.userName,
                    sessionId: auth.sessionId
                }
            }))
        }
    }, [auth.isLoggedIn, auth?.user?.userName, auth.sessionId])

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}

export default SocketProvider
export { SocketContext }