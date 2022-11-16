import { AccountCircle } from '@mui/icons-material'
import React from 'react'
import CustomNavLink from '../CustomNavLink'

function ChatUsers({ isLoading, success, chats }) {
    return (
        <div className='chat-users'>
            {
                !isLoading && (
                    success === true ? (
                        chats.length > 0 ? (
                            chats.map(chat => (
                                <CustomNavLink
                                    to={`/chat/` + chat.chatId}
                                    key={chat.chatId}
                                    className={
                                        ({ isActive }) => isActive ?
                                            'chat-users__link active' :
                                            'chat-users__link'
                                    }
                                >
                                    <div className='chat-users__user'>
                                        <div className='chat-users__user-image'>
                                            <AccountCircle />
                                        </div>
                                        <div className='chat-users__user-name'>
                                            {chat.userName}
                                        </div>
                                    </div>
                                </CustomNavLink>
                            ))
                        ) : <span>No chats</span>
                    ) : <span>Server not responding</span>
                )
            }
        </div>
    )
}

export default ChatUsers