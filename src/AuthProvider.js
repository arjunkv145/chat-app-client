import { createContext, useState } from "react"
import io from "socket.io-client"

const socket = io.connect(process.env.REACT_APP_SOCKET_URL, {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
})
const AuthContext = createContext()

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        accessToken: null,
        isLoggedIn: false
    })

    return (
        <AuthContext.Provider value={{ auth, setAuth, socket }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
export { AuthContext }