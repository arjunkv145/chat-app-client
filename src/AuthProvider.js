import { createContext, useEffect, useState } from "react"
import axiosInstance from "./api/axios"

const AuthContext = createContext([{}, () => { }])

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        accessToken: null,
        isLoggedIn: false,
        emailVerified: false
    })
    const [initialLoadingState, setInitialLoadingState] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const isTokenValid = async () => {
            try {
                const res = await axiosInstance.get('/user', { signal: controller.signal })
                isMounted && setAuth(prev => ({
                    ...prev,
                    user: res.data.user,
                    isLoggedIn: true,
                    emailVerified: res.data.user.emailVerified,
                    accessToken: res.data.accessToken
                }))
            } catch (err) {
            } finally {
                isMounted && setInitialLoadingState(false)
            }
        }

        isTokenValid()
        return () => {
            controller.abort()
            isMounted = false
        }
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth, initialLoadingState }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
export { AuthContext }