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
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂',
        '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗',
        '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗',
        '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏',
        '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴',
        '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴',
        '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟',
        '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧',
        '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
        '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
        '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽',
        '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀',
        '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝',
        '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️',
        '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯',
        '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️',
        '🗨️', '🗯️', '💭', '💤'
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