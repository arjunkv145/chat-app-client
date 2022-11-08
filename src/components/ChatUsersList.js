import { AccountCircle } from '@mui/icons-material'
import React from 'react'
import CustomNavLink from './CustomNavLink'

function ChatUsersList({ usersList }) {
    return (
        <div className='chat-users-list'>
            {
                usersList.map(user => (
                    <CustomNavLink
                        to={`/chat/` + user.id}
                        key={user.id}
                        className={({ isActive }) => isActive ? 'chat-link active' : 'chat-link'}
                    >
                        <div className='chat-user'>
                            <div className='user-image'>
                                <AccountCircle />
                            </div>
                            <div className='user-name'>
                                {user.userName}
                            </div>
                        </div>
                    </CustomNavLink>
                ))
            }
        </div>
    )
}

export default ChatUsersList