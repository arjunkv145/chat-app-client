import React, { useRef, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from "@tanstack/react-query"

function AddFriendMain() {
    const [userName, setUserName] = useState('')
    const [serverResponse, setServerResponse] = useState({
        success: false,
        message: ''
    })
    const userNameRef = useRef()
    const axiosPrivate = useAxiosPrivate()
    const { refetch } = useQuery({
        queryKey: ['send-request'],
        queryFn: () => axiosPrivate.post('friend/request', { userName }),
        onSuccess: data => setServerResponse({
            success: true,
            message: data.data.message
        }),
        onError: error => setServerResponse({
            success: false,
            message: error.response.data.message
        }),
        enabled: false,
        retry: 0
    })

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
                        onChange={e => setUserName(e.target.value)}
                        ref={userNameRef}
                        className="add-friend-add__input"
                    />
                </div>
                {
                    serverResponse.message &&
                    <span style={{ color: 'white' }}
                        className={`add-friend-add__server-message ${serverResponse.success ? 'success' : 'fail'}`}
                    >
                        {serverResponse.message}
                    </span>
                }
                <div className="add-friend-add__btn-wrapper">
                    <button>send request</button>
                </div>
            </form>
        </div>
    )
}

export default AddFriendMain