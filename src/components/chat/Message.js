import { AccountCircle, ArrowBackIos, InsertEmoticon, KeyboardArrowDown, Send } from '@mui/icons-material'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import useSocket from '../../hooks/useSocket'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuth from '../../hooks/useAuth'
import { nanoid } from 'nanoid'

function Message() {
    const { chatId } = useParams()

    const [message, setMessage] = useState('')
    const [messagesContainer, setMessagesContainer] = useState([])

    const messageRef = useRef(null)
    const messagesContainerRef = useRef(null)

    const socket = useSocket()
    const { auth } = useAuth()

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const emojis = [
        '๐', '๐', '๐', '๐', '๐', '๐', '๐คฃ', '๐', '๐',
        '๐', '๐', '๐', '๐', '๐ฅฐ', '๐', '๐คฉ', '๐', '๐',
        '๐', '๐', '๐', '๐', '๐', '๐คช', '๐', '๐ค', '๐ค',
        '๐คญ', '๐คซ', '๐ค', '๐ค', '๐คจ', '๐', '๐', '๐ถ', '๐',
        '๐', '๐', '๐ฌ', '๐คฅ', '๐', '๐', '๐ช', '๐คค', '๐ด',
        '๐ท', '๐ค', '๐ค', '๐คข', '๐คฎ', '๐คง', '๐ฅต', '๐ฅถ', '๐ฅด',
        '๐ต', '๐คฏ', '๐ค ', '๐ฅณ', '๐', '๐ค', '๐ง', '๐', '๐',
        '๐', 'โน๏ธ', '๐ฎ', '๐ฏ', '๐ฒ', '๐ณ', '๐ฅบ', '๐ฆ', '๐ง',
        '๐จ', '๐ฐ', '๐ฅ', '๐ข', '๐ญ', '๐ฑ', '๐', '๐ฃ', '๐',
        '๐', '๐ฉ', '๐ซ', '๐ฅฑ', '๐ค', '๐ก', '๐ ', '๐คฌ', '๐',
        '๐ฟ', '๐', 'โ ๏ธ', '๐ฉ', '๐คก', '๐น', '๐บ', '๐ป', '๐ฝ',
        '๐พ', '๐ค', '๐บ', '๐ธ', '๐น', '๐ป', '๐ผ', '๐ฝ', '๐',
        '๐ฟ', '๐พ', '๐', '๐', '๐', '๐', '๐', '๐', '๐',
        '๐', '๐', '๐', '๐', '๐', '๐', 'โฃ๏ธ', '๐', 'โค๏ธ',
        '๐งก', '๐', '๐', '๐', '๐', '๐ค', '๐ค', '๐ค', '๐ฏ',
        '๐ข', '๐ฅ', '๐ซ', '๐ฆ', '๐จ', '๐ณ๏ธ', '๐ฃ', '๐ฌ', '๐๏ธโ๐จ๏ธ',
        '๐จ๏ธ', '๐ฏ๏ธ', '๐ญ', '๐ค'
    ]
    const [openEmojisWindow, setOpenEmojisWindow] = useState(false)

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
            const messages = data?.data.message.messages.map(message => {
                return (
                    <div className={`message__message-wrapper ${message.userName !== chatRoom?.userName ? 'sent' : ''}`} key={nanoid()}>
                        <span className='message__message'>
                            {message.message}
                        </span>
                    </div>
                )
            })
            setMessagesContainer(prev => [...prev, ...messages])
        },
        onError: () => alert("Can't get messages from the server"),
        enabled: !!chatRoom?.friends
    })
    const { mutate: acceptRequest } = useMutation(
        values => axiosPrivate.post('/friend/accept', values),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('chat-room')
                socket.emit('friend_request_accepted', { userName: chatRoom.userName })
            },
            onError: () => alert("Couldn't accept request"),
        }
    )
    const { mutate: rejectRequest } = useMutation(
        values => axiosPrivate.post('/friend/reject', values),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('chats')
                socket.emit('friend_request_rejected', { userName: chatRoom.userName })
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
        socket.emit('send_message', { message, chatId, userName: auth.user.userName })
        setMessagesContainer(prev => [
            ...prev,
            <div className='message__message-wrapper sent' key={nanoid()}>
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
    }, [isLoading])

    useEffect(() => {
        socket.emit('join_chatroom', chatId)
    }, [socket, chatId])

    useEffect(() => {
        const receiveMessage = ({ message }) => {
            setMessagesContainer(prev => [
                ...prev,
                <div className='message__message-wrapper' key={nanoid()}>
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
                    {messagesContainer}
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
                            <>
                                <div className={`message__emojis-window ${openEmojisWindow ? 'open' : ''}`}>
                                    <div className='message__emojis-window-header'>
                                        <button
                                            className='message__close-emojis-window-btn'
                                            onClick={() => setOpenEmojisWindow(prev => !prev)}
                                        >
                                            <KeyboardArrowDown />
                                        </button>
                                        <p className='message__emojis-window-title'>Emojis</p>
                                    </div>
                                    <div className='message__emojis-window-body'>
                                        {
                                            emojis.map((emoji, i) => (
                                                <button
                                                    key={i}
                                                    className='message__emoji'
                                                    onClick={e => setMessage(prev => `${prev}${e.target.innerText}`)}
                                                >{emoji}</button>
                                            ))
                                        }
                                    </div>
                                </div>
                                <button
                                    className='message__open-emojis-window-btn'
                                    onClick={() => setOpenEmojisWindow(prev => !prev)}
                                >
                                    <InsertEmoticon />
                                </button>
                                <form className='message__form' onSubmit={sendMessage}>
                                    <input
                                        type='text'
                                        className='message__form-input'
                                        placeholder="Type a message..."
                                        autoComplete="off"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        ref={messageRef}
                                    />
                                    <div className='message__form-btn-wrapper'>
                                        <button className='btn btn--send'><Send /></button>
                                    </div>
                                </form>
                            </>
                    }
                </div>
            </div>
        )
    )
}

export default Message