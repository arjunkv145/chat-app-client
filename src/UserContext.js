import axios from "axios";
import { createContext, useEffect, useState } from "react";

const UserContext = createContext()

const getJWT = () => {
    const jwt = localStorage.getItem("jwt");
    return jwt ? jwt : null;
}

function UserProvider(props) {
    const [user, setUser] = useState({
        user: null,
        token: null,
        isLoggedIn: false
    });

    useEffect(() => {
        axios.get('isauthenticated')
            .then(res => {
                if (res.data.success === true) {
                    setUser(prev => ({
                        ...prev,
                        user: res.data.user,
                        token: getJWT(),
                        isLoggedIn: true
                    }));
                }
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider, getJWT };