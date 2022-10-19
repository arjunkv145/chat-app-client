import { createContext, useEffect, useState } from "react"
import axios from "./api/axios"

const AuthContext = createContext([{}, () => { }])

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        accessToken: null,
        isLoggedIn: false,
        initialLoadingState: true
    })

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true;
        axios.post('refreshtoken', { signal: controller.signal })
            .then(res => {
                if (res.data.success === true) {
                    isMounted && setAuth(prev => ({
                        ...prev,
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                        isLoggedIn: true,
                        initialLoadingState: false
                    }))
                }
                console.log(res)
            })
            .catch(err => {
                console.log(err.response.data)
                isMounted && setAuth(prev => ({
                    ...prev,
                    initialLoadingState: false
                }))
            })
        return () => {
            controller.abort()
            isMounted = false
        }
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
export { AuthContext }