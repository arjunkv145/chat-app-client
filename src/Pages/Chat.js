import "./sassStyles/chat.scss"
import useAuth from "../hooks/useAuth"
import axiosInstance from "../api/axios"
import { Link } from "react-router-dom"
import { useState } from "react"
import PopupAlert from "../components/PopupAlert"

function Chat() {
    const { setAuth } = useAuth()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)

    const logout = async () => {
        try {
            await axiosInstance.get('logout')
            setAuth(prev => ({
                ...prev,
                user: null,
                accessToken: null,
                isLoggedIn: false
            }))
        } catch (err) {
            setOpenPopupAlert(true)
        }
    }

    return (
        <div className="chat-container">
            chat page
            <Link to='/group'>go to groups page</Link>
            <button onClick={logout}>Logout</button>
            <PopupAlert
                title="Can't log out"
                body="The server is not responding at the moment, please try again later."
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
        </div>
    )
}

export default Chat