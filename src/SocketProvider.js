import { createContext, useEffect } from "react"
import useAuth from "./hooks/useAuth"
import io from "socket.io-client"

const SocketContext = createContext()
const socket = io.connect(process.env.REACT_APP_SOCKET_URL, {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
})

function SocketProvider(props) {
    const { auth } = useAuth()

    useEffect(() => {
        if (auth.isLoggedIn === true) {
            socket.emit('join_room', auth.user.userName)
        }
    }, [auth.isLoggedIn, auth.user.userName])

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}

export default SocketProvider
export { SocketContext }