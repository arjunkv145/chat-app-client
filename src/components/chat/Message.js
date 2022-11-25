import { AccountCircle, ArrowBackIos, Send } from '@mui/icons-material'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import useSocket from '../../hooks/useSocket'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

function Message() {
    const { chatId } = useParams()
    const [message, setMessage] = useState('')
    const [messagesElement, setMessagesElement] = useState([])
    const messageRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const socket = useSocket()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: chatRoom, isLoading } = useQuery({
        queryKey: ['chat-room', chatId],
        queryFn: () => axiosPrivate.get(`/chat/${chatId}`),
        onError: () => navigate('/chat', { replace: true }),
        select: data => data.data.chatRoom
    })
    useQuery({
        queryKey: ['message', chatId],
        queryFn: () => axiosPrivate.get(`/chat/messages/${chatId}`),
        onSuccess: data => {
            const messages = data.data.message.messages.map((message, i) => {
                return (
                    <div className='message__message-wrapper sent' key={i + 1}>
                        <span className='message__message'>
                            {message.message}
                        </span>
                    </div>
                )
            })
            setMessagesElement(prev => [...prev, ...messages])
        },
        onError: () => alert("Can't get messages from the server"),
        enabled: !!chatRoom
    })
    const { mutate: acceptRequest } = useMutation(
        values => axiosPrivate.post('/friend/accept', values),
        {
            onSuccess: () => queryClient.invalidateQueries('chat-room'),
            onError: () => alert("Couldn't accept request"),
        }
    )
    const { mutate: rejectRequest } = useMutation(
        values => axiosPrivate.post('/friend/reject', values),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('chats')
                navigate('/chat', { replace: true })
            },
            onError: () => alert("Couldn't reject request"),
        }
    )

    const sendMessage = e => {
        e.preventDefault()
        if (message === '') {
            return null
        }
        socket.emit('send_message', { message, chatId, userName: chatRoom.userName })
        setMessagesElement(prev => [
            ...prev,
            <div className='message__message-wrapper sent' key={prev.length + 1}>
                <span className='message__message'>
                    {message}
                </span>
            </div>
        ])
        setMessage('')
    }

    useEffect(() => {
        if (!isLoading && !chatRoom?.pending) {
            messageRef.current.focus()
        }
    }, [isLoading, chatRoom?.pending])

    useEffect(() => {
        if (!isLoading) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [messagesElement, isLoading])

    useEffect(() => {
        const receiveMessage = ({ message }) => {
            setMessagesElement(prev => [
                ...prev,
                <div className='message__message-wrapper' key={prev.length + 1}>
                    <span className='message__message'>
                        {message}
                    </span>
                </div>
            ])
        }
        socket.on('receive_message', receiveMessage)

        return () => {
            socket.off('receive_message', receiveMessage)
        }
    }, [socket])

    return (
        !isLoading && (
            <div className='message'>
                <div className='message__header'>
                    <div className='message__close-btn'>
                        <NavLink to='/chat'>
                            <ArrowBackIos />
                        </NavLink>
                    </div>
                    <div className='message__pfp'>
                        <AccountCircle />
                    </div>
                    <div className='message__name'>
                        {chatRoom?.userName}
                    </div>
                </div>
                <div className={`message__body ${chatRoom?.pending ? 'pending' : ''}`} ref={messagesContainerRef}>
                    {messagesElement}
                </div>
                <div className={`message__footer ${chatRoom?.pending ? 'pending' : ''}`}>
                    {
                        (!isLoading && chatRoom?.pending) ?
                            <div className='message__pending'>
                                <p className='message__pending-text'>{chatRoom?.userName} has sent you a friend request</p>
                                <div className='message__pending-btn-wrapper'>
                                    <button
                                        className='btn btn--accept'
                                        onClick={() => acceptRequest({ chatId, userName: chatRoom?.userName })}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className='btn btn--reject'
                                        onClick={() => rejectRequest({ chatId, userName: chatRoom?.userName })}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                            :
                            <form className='message__message-form' onSubmit={sendMessage}>
                                <input
                                    type='text'
                                    className='message__message-input'
                                    placeholder="Type a message..."
                                    autoComplete="off"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    ref={messageRef}
                                />
                                <div className='message__message-btn-wrapper'>
                                    <button className='btn btn--send'><Send /></button>
                                </div>
                            </form>
                    }
                </div>
            </div>
        )
    )
}

export default Message