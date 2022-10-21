import "./sassStyles/chat.scss"
import { useEffect } from "react"
import useAuth from "../hooks/useAuth"
import axios from "../api/axios"
import { Link, useNavigate } from "react-router-dom"

function Chat() {
    const { auth, setAuth, initialLoadingState } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (initialLoadingState === false && auth.isLoggedIn === false) {
            navigate('/')
        }
    }, [initialLoadingState, auth.isLoggedIn, navigate])

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
            <Link to='/group'>go to groups page</Link>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Chat