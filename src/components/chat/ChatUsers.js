import { AccountCircle } from '@mui/icons-material'
import React from 'react'
import CustomNavLink from '../CustomNavLink'

function ChatUsers({ users }) {
    return (
        <div className='chat-users'>
            {
                users.map(user => (
                    <CustomNavLink
                        to={`/chat/` + user.id}
                        key={user.id}
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
                                {user.userName}
                            </div>
                        </div>
                    </CustomNavLink>
                ))
            }
        </div>
    )
}

export default ChatUsers