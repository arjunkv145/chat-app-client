import { AccountCircle } from '@mui/icons-material'
import React from 'react'
import CustomNavLink from '../CustomNavLink'

function Chats({ isLoading, chats }) {
    return (
        <div className='chats'>
            {
                !isLoading && (
                    chats.length > 0 ? (
                        chats.map(chat => (
                            <CustomNavLink
                                to={`/chat/` + chat.chatId}
                                key={chat.chatId}
                                className={
                                    ({ isActive }) => isActive ?
                                        'chats__link active' :
                                        'chats__link'
                                }
                            >
                                <div className='chats__list-item'>
                                    <div className='chats__image'>
                                        <AccountCircle />
                                    </div>
                                    <div className='chats__name'>
                                        {chat.userName}
                                    </div>
                                </div>
                            </CustomNavLink>
                        ))
                    ) : <div className='chats__tag'>No chats</div>
                )
            }
        </div>
    )
}

export default Chats