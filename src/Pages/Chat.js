import React from 'react'
import { Outlet, useLoaderData, useLocation } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import ChatUsersList from '../components/ChatUsersList'
import "./sassStyles/chat.scss"

export const loader = async ({ request }) => {
    const { data } = await axiosInstance.get('/userslist', { signal: request.signal })
    return data
}

function Chat() {
    const location = useLocation()
    const { usersList } = useLoaderData()

    return (
        <main className="chat-container">
            <section
                className={location.pathname === '/chat' ? 'users-section' : 'users-section hide'}
            >
                <h1 className="title">Chat</h1>
                <ChatUsersList usersList={usersList} />
            </section>
            <section
                className={location.pathname === '/chat' ? 'message-section hide' : 'message-section'}
            >
                {
                    location.pathname === '/chat'
                    &&
                    <span className='start-message'>Start chatting</span>
                }
                <Outlet />
            </section>
        </main>
    )
}

export default Chat