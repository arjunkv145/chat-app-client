import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { Outlet, useLocation } from 'react-router-dom'
import ChatUsers from '../components/chat/ChatUsers'

function Chat() {
    const location = useLocation()
    const [success, setSuccess] = useState(false)
    const [chats, setChats] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const fetchData = async () => {
            try {
                const { data } = await axiosPrivate.get('/chat', { signal: controller.signal })
                isMounted && setSuccess(true)
                isMounted && setChats(data.chats)
            } catch (err) {
                isMounted && setSuccess(false)
            } finally {
                isMounted && setIsLoading(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [axiosPrivate])

    return (
        <main className="chat main-resizable">
            <section
                className='main-resizable__left'
            >
                <h1 className='chat__title'>Chat</h1>
                <div className='chat__users'>
                    <ChatUsers chats={chats} isLoading={isLoading} success={success} />
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