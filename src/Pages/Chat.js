import "./sassStyles/chat.scss"
import useAuth from "../hooks/useAuth"
import axiosInstance from "../api/axios"
import { Link } from "react-router-dom"

function Chat() {
    const { setAuth } = useAuth()

    const logout = () => {
        axiosInstance.get('logout').then(res => {
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
            <Link to='/group'>go to groups page</Link>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Chat