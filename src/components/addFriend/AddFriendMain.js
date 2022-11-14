import React from 'react'
import { useParams } from 'react-router-dom'

function AddFriendMain() {
    const { option } = useParams()

    return (
        <div>{option}</div>
    )
}

export default AddFriendMain