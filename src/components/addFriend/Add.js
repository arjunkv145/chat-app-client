import React, { useRef, useState } from 'react'
import Button from '../Button'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function AddFriendMain() {
    const [userName, setUserName] = useState('')
    const [serverMessage, setServerMessage] = useState({
        success: false,
        message: null
    })
    const userNameRef = useRef()
    const axiosPrivate = useAxiosPrivate()

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axiosPrivate.post('friend/request', { userName })
            setServerMessage({
                success: res.data.success,
                message: res.data.message,
            })
        } catch (err) {
            setServerMessage({
                success: false,
                message: 'Server not responding',
            })
            console.log(err)
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
                    serverMessage.message &&
                    <span style={{ color: 'white' }}
                        className={`add-friend-add__server-message ${serverMessage.success ? 'success' : 'fail'}`}
                    >
                        {serverMessage.message}
                    </span>
                }
                <div className="add-friend-add__btn-wrapper">
                    <Button>send request</Button>
                </div>
            </form>
        </div>
    )
}

export default AddFriendMain