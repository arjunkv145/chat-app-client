import React from 'react'
import { Outlet } from 'react-router-dom'
import ChatUsersList from '../components/ChatUsersList'
import "./sassStyles/chat.scss"

function Chat() {
    const users = [
        { id: 1, user: "user1" },
        { id: 2, user: "user2" },
        { id: 3, user: "user3" },
        { id: 4, user: "user4" },
        { id: 5, user: "user5" },
    ]

    return (
        <>
            <main className="chat-container">
                <h1 className="title">Chat</h1>
                <ChatUsersList usersList={users} />
                <Outlet />
            </main>
        </>
    )
}

export default Chat