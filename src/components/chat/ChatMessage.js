import { AccountCircle, ArrowBackIos, Send } from '@mui/icons-material'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import useSocket from '../../hooks/useSocket'
import Button from '../Button'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function ChatMessage() {
    const { chatId } = useParams()
    const [chatRoom, setChatRoom] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [messagesElement, setMessagesElement] = useState([])
    const messageRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const socket = useSocket()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const sendMessage = e => {
        e.preventDefault()
        if (message === '') {
            return null
        }
        socket.emit('send_message', { message })
        setMessagesElement(prev => [
            ...prev,
            <div className='chat-message__message-wrapper sent' key={prev.length + 1}>
                <span className='chat-message__message'>
                    {message}
                </span>
            </div>
        ])
        setMessage('')
    }
    const acceptRequest = async () => {
        try {
            await axiosPrivate.post('/friend/accept', { chatId, userName: chatRoom.userName })
            setChatRoom(prev => ({
                ...prev,
                friends: true,
                pending: false
            }))
        } catch (err) {
            console.log(err)
            alert('couldnt accept request')
        }
    }
    const rejectRequest = async () => {
        try {
            await axiosPrivate.post('/friend/reject', { chatId, userName: chatRoom.userName })
            setChatRoom(prev => ({
                ...prev,
                friends: false,
                pending: false
            }))
        } catch (err) {
            console.log(err)
            alert('couldnt reject request')
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const fetchData = async () => {
            try {
                const { data } = await axiosPrivate.get('/chat/' + chatId, { signal: controller.signal })
                isMounted && setChatRoom(data.chatRoom)
            } catch (err) {
                navigate('/chat', { replace: true })
            } finally {
                isMounted && setIsLoading(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [axiosPrivate, chatId, navigate])

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
                <div className='chat-message__message-wrapper' key={prev.length + 1}>
                    <span className='chat-message__message'>
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
            <div className='chat-message'>
                <div className='chat-message__header'>
                    <div className='chat-message__close-btn'>
                        <NavLink to='/chat'>
                            <span className='chat-message__left-arrow-icon'>
                                <ArrowBackIos />
                            </span>
                        </NavLink>
                    </div>
                    <div className='chat-message__user-image'>
                        <AccountCircle />
                    </div>
                    <div className='chat-message__user-name'>
                        {chatRoom.userName}
                    </div>
                </div>
                <div className='chat-message__messages' ref={messagesContainerRef}>
                    {messagesElement}
                    {
                        chatRoom.pending &&
                        <div className='friend-request-form'>
                            <p>{chatRoom.userName} has sent you a friend request</p>
                            <Button onClick={acceptRequest} style={{ borderRadius: '10px' }}>Accept</Button>
                            <Button onClick={rejectRequest} style={{ borderRadius: '10px' }}>Reject</Button>
                        </div>
                    }
                </div>
                <form className='chat-message__send' onSubmit={sendMessage}>
                    <input
                        type='text'
                        className='chat-message__input'
                        placeholder="Type a message..."
                        autoComplete="off"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        ref={messageRef}
                    />
                    <div className='chat-message__btn-wrapper'>
                        <Button><Send /></Button>
                    </div>
                </form>
            </div>
        )
    )
}

export default ChatMessage