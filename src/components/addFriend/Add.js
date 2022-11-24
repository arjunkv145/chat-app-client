import React, { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation } from "@tanstack/react-query"

function Add() {
    const [userName, setUserName] = useState('')
    const [serverResponse, setServerResponse] = useState({
        status: null,
        message: ''
    })
    const userNameRef = useRef()
    const axiosPrivate = useAxiosPrivate()
    const { mutate } = useMutation(
        userName => axiosPrivate.post('friend/request', { userName }),
        {
            onSuccess: data => {
                setServerResponse({ status: 'success', message: data.data.message })
                setUserName('')
            },
            onError: error => setServerResponse({ status: 'fail', message: error.response.data.message })
        }
    )

    const handleChange = e => {
        setUserName(e.target.value)
        setServerResponse({ status: null, message: '' })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (userName.trim() !== '') {
            mutate(userName)
        }
    }

    useEffect(() => {
        userNameRef.current.focus()
    }, [])

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
                    {
                        serverResponse.message &&
                        <span
                            className={`add-friend-add__server-message ${serverResponse.status && serverResponse.status}`}
                        >
                            {serverResponse.message}
                        </span>
                    }
                    <button className='btn' disabled={userName.trim() === '' && true}>send request</button>
                </div>
            </form>
        </div>
    )
}

export default Add