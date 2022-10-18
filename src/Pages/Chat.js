import "./sassStyles/chat.scss"
// import { useContext, useEffect } from "react"
// import { removeJWT, UserContext } from "../AuthProvider"
// import { useNavigate } from "react-router-dom"

function Chat() {
    // const { user, setUser } = useContext(UserContext)
    // const navigate = useNavigate()
    // useEffect(() => {
    //     if (user.isLoggedIn === false) {
    //         navigate('/login')
    //     }
    // }, [navigate, user.isLoggedIn])

    // const logout = () => {
    //     removeJWT();
    //     setUser(prev => ({
    //         ...prev,
    //         user: null,
    //         isLoggedIn: false
    //     }))
    // }

    return (
        <div className="chat-page">
            chat page
            {/* <button onClick={logout}>Logout</button> */}
        </div>
    )
}

export default Chat