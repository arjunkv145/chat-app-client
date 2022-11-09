import { AccountCircle, ArrowBackIos } from '@mui/icons-material'
import React from 'react'
import { NavLink, useLoaderData } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import Button from './Button'

export const loader = async ({ params, request }) => {
    const { data } = await axiosInstance.get('/user/' + params.userId, { signal: request.signal })
    return data
}

function ChatMessage() {
    const { user } = useLoaderData()

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
            <div className='chat-message__message'>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
                <p>dfdfgdfg</p>
            </div>
            <div className='chat-message__send'>
                <input
                    type='text'
                    className='chat-message__input'
                    placeholder="Type a message..."
                    autoComplete="off"
                />
                <Button>send</Button>
            </div>
        </div>
    )
}

export default ChatMessage