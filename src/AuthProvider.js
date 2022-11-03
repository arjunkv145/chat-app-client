import { createContext, useState } from "react"

const AuthContext = createContext()

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        accessToken: null,
        isLoggedIn: false
    })

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
export { AuthContext }