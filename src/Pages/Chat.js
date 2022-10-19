import "./sassStyles/chat.scss"
// import { useContext, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import axios from "../api/axios"
// import { useNavigate } from "react-router-dom"

function Chat() {
    const { setAuth } = useAuth()
    // const navigate = useNavigate()
    // useEffect(() => {
    //     if (user.isLoggedIn === false) {
    //         navigate('/login')
    //     }
    // }, [navigate, user.isLoggedIn])

    const logout = () => {
        axios.get('logout').then(res => {
            console.log(res.data)
            setAuth(prev => ({
                ...prev,
                user: null,
                accessToken: null,
                isLoggedIn: false
            }))
        })
    }

    return (
        <div className="chat-page">
            chat page
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Chat