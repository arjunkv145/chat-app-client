// import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext()

function AuthProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        isLoggedIn: false
    });

    // useEffect(() => {
    //     axios.get('isauthenticated')
    //         .then(res => {
    //             if (res.data.success === true) {
    //                 setAuth(prev => ({
    //                     ...prev,
    //                     user: res.data.user,
    //                     isLoggedIn: true
    //                 }));
    //             }
    //         })
    //         .catch(err => console.log(err))
    // }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export { AuthContext };