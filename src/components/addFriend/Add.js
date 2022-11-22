import React, { useRef, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from "@tanstack/react-query"

function AddFriendMain() {
    const [userName, setUserName] = useState('')
    const [serverResponse, setServerResponse] = useState({
        status: null,
        message: ''
    })
    const userNameRef = useRef()
    const axiosPrivate = useAxiosPrivate()
    const { refetch } = useQuery({
        queryKey: ['send-request'],
        queryFn: () => axiosPrivate.post('friend/request', { userName }),
        onSuccess: data => setServerResponse({
            status: 'success',
            message: data.data.message
        }),
        onError: error => setServerResponse({
            status: 'fail',
            message: error.response.data.message
        }),
        enabled: false,
        retry: 0
    })

    const handleChange = e => {
        setUserName(e.target.value)
        setServerResponse({
            status: null,
            message: ''
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (userName.trim() !== '') {
            refetch()
        }
    }

    return (
        <div className='add-friend-add'>
            <form onSubmit={handleSubmit}>
                <div className="add-friend-add__input-wrapper">
                    <input
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                        value={userName}
                        onChange={handleChange}
                        ref={userNameRef}
                        className={`add-friend-add__input ${serverResponse.status && serverResponse.status}`}
                    />
                    <button className='btn' disabled={userName.trim() === '' && true}>send request</button>
                </div>
                {
                    serverResponse.message &&
                    <span
                        className={`add-friend-add__server-message ${serverResponse.status && serverResponse.status}`}
                    >
                        {serverResponse.message}
                    </span>
                }
            </form>
        </div>
    )
}

export default AddFriendMain