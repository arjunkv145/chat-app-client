import React from 'react'
import { Outlet, useLoaderData, useLocation } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import ChatUsersList from '../components/ChatUsersList'

export const loader = async ({ request }) => {
    const { data } = await axiosInstance.get('/userslist', { signal: request.signal })
    return data
}

function Chat() {
    const location = useLocation()
    const { usersList } = useLoaderData()

    return (
        <main className="chat">
            <section
                className={
                    location.pathname === '/chat' ?
                        'chat__user-list-section' :
                        'chat__user-list-section hide'
                }
            >
                <h1 className="chat__title">Chat</h1>
                <ChatUsersList usersList={usersList} />
            </section>
            <section
                className={
                    location.pathname === '/chat' ?
                        'chat__message-section hide' :
                        'chat__message-section'
                }
            >
                {
                    location.pathname === '/chat'
                    &&
                    <span className='chat__start-message'>Start chatting</span>
                }
                <Outlet />
            </section>
        </main>
    )
}

export default Chat