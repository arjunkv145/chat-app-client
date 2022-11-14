import React from 'react'
import { Outlet, useLoaderData, useLocation } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import ChatUsers from '../components/chat/ChatUsers'

export const loader = async ({ request }) => {
    try {
        const { data } = await axiosInstance.get('/userslist', { signal: request.signal })
        return data
    } catch (err) {
        const message = err?.response?.data?.message
        const data = { success: false, message: message ? message : 'Server not responding' }
        return { data }
    }
}

function Chat() {
    const location = useLocation()
    const { usersList } = useLoaderData()

    return (
        <main className="chat main-resizable">
            <section
                className='main-resizable__left'
            >
                <h1 className='chat__title'>Chat</h1>
                <div className='chat__users'>
                    <ChatUsers users={usersList} />
                </div>
            </section>
            <section
                className={
                    (location.pathname === '/chat' || location.pathname === '/chat/') ?
                        'main-resizable__right hide' :
                        'main-resizable__right'
                }
            >
                {
                    (location.pathname === '/chat' || location.pathname === '/chat/')
                    &&
                    <span className='chat__start-message'>Start chatting</span>
                }
                <Outlet />
            </section>
        </main>
    )
}

export default Chat