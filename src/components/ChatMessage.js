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
            <div className='chat-header'>
                <div className='chat-close-mobile'>
                    <NavLink to='/chat'>
                        <span className='left-arrow-icon'>
                            <ArrowBackIos />
                        </span>
                    </NavLink>
                </div>
                <div className='user-image'>
                    <AccountCircle />
                </div>
                <div className='user-name'>
                    {user.userName}
                </div>
                <NavLink to='/chat' className='chat-close-desktop'>
                    <Button>close</Button>
                </NavLink>
            </div>
            <div className='chat-messages'>
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
            <div className='chat-send-form'>
                <input
                    type='text'
                    className='chat-input'
                    placeholder="Type a message..."
                    autoComplete="off"
                />
                <Button>send</Button>
            </div>
        </div>
    )
}

export default ChatMessage