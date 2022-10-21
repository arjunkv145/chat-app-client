import { createContext, useEffect, useState } from "react"
// import axios from "./api/axios"
import useAxiosPrivate from "./hooks/useAxiosPrivate"

const AuthContext = createContext([{}, () => { }])

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        accessToken: null,
        isLoggedIn: false
    })
    console.log(auth.isLoggedIn)
    const [initialLoadingState, setInitialLoadingState] = useState(true)
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const isTokenValid = async () => {
            try {
                const res = await axiosPrivate.get('/', { signal: controller.signal })
                console.log("hi")
                console.log(res)
                console.log("hi")
            } catch (err) {
                console.log(err.response)
            } finally {
                isMounted && setInitialLoadingState(false)
            }
        }

        isTokenValid()
        return () => {
            controller.abort()
            isMounted = false
        }
    }, [axiosPrivate])

    return (
        <AuthContext.Provider value={{ auth, setAuth, initialLoadingState }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
export { AuthContext }