import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useQuery } from "@tanstack/react-query"
import { Outlet, useLocation } from 'react-router-dom'
import Chats from '../components/chat/Chats'
import SearchChat from '../components/chat/SearchChat'

function Chat() {
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()
    const { data, isLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: () => axiosPrivate.get('/chat')
    })

    return (
        <main className='chat responsive'>
            <section className='responsive__side'>
                <div className='responsive__side-header'>
                    <h1 className='responsive__title'>Chat</h1>
                </div>
                <div className='responsive__side-body'>
                    <div className='chat__search'>
                        <div className='chat__search-input' tabIndex={0}>search or start a chat</div>
                    </div>
                    <Chats chats={data?.data?.chats} isLoading={isLoading} />
                </div>
                <SearchChat />
            </section>
            <section
                className={
                    (location.pathname === '/chat' || location.pathname === '/chat/') ?
                        'responsive__main hide' :
                        'responsive__main'
                }
            >
                {
                    (location.pathname === '/chat' || location.pathname === '/chat/')
                    &&
                    <span className='responsive__tag'>Start chatting</span>
                }
                <Outlet />
            </section>
        </main>
    )
}

export default Chat