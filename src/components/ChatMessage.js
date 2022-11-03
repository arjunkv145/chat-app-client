import React from 'react'
import { useParams } from 'react-router-dom'

function ChatMessage() {
    const { chatId } = useParams()

    return (
        <div>
            ChatMessage
            {chatId}
        </div>
    )
}

export default ChatMessage