import { AccountCircle, ArrowBackIos, Send } from '@mui/icons-material'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, redirect, useLoaderData } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import Button from '../Button'
import useAuth from '../../hooks/useAuth'

export const loader = async ({ params, request }) => {
    try {
        const { data } = await axiosInstance.get('/user/' + params.userId, { signal: request.signal })
        return data
    } catch (err) {
        return redirect('/chat')
    }
}

function ChatMessage() {
    const { user } = useLoaderData()
    const { socket } = useAuth()
    const [message, setMessage] = useState('')
    const [messagesElement, setMessagesElement] = useState([])
    const messageRef = useRef(null)
    const messagesContainerRef = useRef(null)

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

    useEffect(() => {
        messageRef.current.focus()
    }, [])

    useEffect(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }, [messagesElement])

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
                    {user.userName}
                </div>
            </div>
            <div className='chat-message__messages' ref={messagesContainerRef}>
                {messagesElement}
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
}

export default ChatMessage