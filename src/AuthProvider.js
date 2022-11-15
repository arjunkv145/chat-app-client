import { createContext, useState } from "react"

const AuthContext = createContext()

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: {},
        accessToken: null,
        isLoggedIn: false,
        sessionId: null
    })

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
export { AuthContext }