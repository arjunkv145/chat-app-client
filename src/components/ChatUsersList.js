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
                        className={
                            ({ isActive }) => isActive ?
                                'chat-users-list__link active' :
                                'chat-users-list__link'
                        }
                    >
                        <div className='chat-users-list__user'>
                            <div className='chat-users-list__user-image'>
                                <AccountCircle />
                            </div>
                            <div className='chat-users-list__user-name'>
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