import { AccountCircle, ArrowBackIos, Send } from '@mui/icons-material'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import useSocket from '../../hooks/useSocket'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'

function Message() {
    const { chatId } = useParams()
    const [chatRoom, setChatRoom] = useState([])
    const [message, setMessage] = useState('')
    const [messagesElement, setMessagesElement] = useState([])
    const messageRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const socket = useSocket()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const { isLoading } = useQuery({
        queryKey: ['chat-room'],
        queryFn: () => axiosPrivate.get(`/chat/${chatId}`),
        onSuccess: data => setChatRoom(data.data.chatRoom),
        onError: () => navigate('/chat', { replace: true })
    })
    const { refetch: acceptRequest } = useQuery({
        queryKey: ['accept-request'],
        queryFn: () => axiosPrivate.post('/friend/accept', { chatId, userName: chatRoom.userName }),
        onSuccess: () => setChatRoom(prev => ({
            ...prev,
            friends: true,
            pending: false
        })),
        onError: () => alert("Couldn't accept request"),
        enabled: false
    })
    const { refetch: rejectRequest } = useQuery({
        queryKey: ['reject-request'],
        queryFn: () => axiosPrivate.post('/friend/reject', { chatId, userName: chatRoom.userName }),
        onSuccess: () => setChatRoom(prev => ({
            ...prev,
            friends: false,
            pending: false
        })),
        onError: () => alert("Couldn't reject request"),
        enabled: false
    })

    const sendMessage = e => {
        e.preventDefault()
        if (message === '') {
            return null
        }
        socket.emit('send_message', { message })
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
        if (!isLoading) {
            messageRef.current.focus()
        }
    }, [isLoading])

    useEffect(() => {
        if (!isLoading) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [messagesElement, isLoading])

    useEffect(() => {
        const receiveMessage = data => {
            console.log(data)
            setMessagesElement(prev => [
                ...prev,
                <div className='message__message-wrapper' key={prev.length + 1}>
                    <span className='message__message'>
                        {data.message}
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
                        {chatRoom.userName}
                    </div>
                </div>
                <div className='message__body' ref={messagesContainerRef}>
                    {messagesElement}
                </div>
                <div className='message__footer'>
                    {
                        chatRoom.pending ?
                            <div className='message__pending'>
                                <p className='message__pending-text'>{chatRoom.userName} has sent you a friend request</p>
                                <button className='btn' onClick={acceptRequest}>
                                    Accept
                                </button>
                                <button className='btn' onClick={rejectRequest}>
                                    Reject
                                </button>
                            </div>
                            :
                            <form className='message__input-form' onSubmit={sendMessage}>
                                <input
                                    type='text'
                                    className='message__input'
                                    placeholder="Type a message..."
                                    autoComplete="off"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    ref={messageRef}
                                />
                                <div className='message__btn-wrapper'>
                                    <button className='btn'><Send /></button>
                                </div>
                            </form>
                    }
                </div>
            </div>
        )
    )
}

export default Message