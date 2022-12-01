import React, { useEffect, useRef, useState } from 'react'
import { Close } from '@mui/icons-material'

function SearchChat() {
    const [chat, setChat] = useState('')
    const chatRef = useRef(null)

    useEffect(() => {
        chatRef.current.focus()
    }, [])

    return (
        <div className='search-chat-background'>
            <div className='search-chat'>
                <div className='search-chat__header'>
                    <button className='search-chat__close-btn'>
                        <Close />
                    </button>
                </div>
                <div className="form__input-wrapper">
                    <input
                        type="text"
                        placeholder="Enter username"
                        autoComplete="off"
                        value={chat}
                        onChange={e => setChat(e.target.value)}
                        ref={chatRef}
                        className="form__input"
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchChat