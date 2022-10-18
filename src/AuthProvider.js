import { createContext, useEffect, useState } from "react"
import useAxiosPrivate from "./hooks/useAxiosPrivate"

const AuthContext = createContext([{}, () => { }])

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        accessToken: null,
        isLoggedIn: false,
        initialLoadingState: true
    })
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true;
        axiosPrivate.post('refreshtoken', { signal: controller.signal })
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
            })
            .catch(err => console.log(err, "hii"))
        return () => {
            controller.abort()
            isMounted = false
        }
    }, [axiosPrivate])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
export { AuthContext }