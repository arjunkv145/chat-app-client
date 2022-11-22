import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useQuery } from "@tanstack/react-query"
import { Outlet, useLocation } from 'react-router-dom'
import ChatUsers from '../components/chat/ChatUsers'

function Chat() {
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()
    const { data, isLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: () => axiosPrivate.get('/chat')
    })

    return (
        <main className="chat main-resizable">
            <section
                className='main-resizable__left'
            >
                <h1 className='main-resizable__title'>Chat</h1>
                <div className='main-resizable__body'>
                    <ChatUsers chats={data?.data?.chats} isLoading={isLoading} />
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
                    <span className='main-resizable__tag'>Start chatting</span>
                }
                <Outlet />
            </section>
        </main>
    )
}

export default Chat