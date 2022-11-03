import React from 'react'
import { NavLink } from 'react-router-dom'

function ChatUsersList({ usersList }) {
    return (
        <div className='chat-users-list'>
            {
                usersList.map(user => (
                    <NavLink to={`/chat/` + user.id} key={user.id}>{user.user}</NavLink>
                ))
            }
        </div>
    )
}

export default ChatUsersList