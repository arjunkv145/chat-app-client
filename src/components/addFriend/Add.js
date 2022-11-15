import React, { useRef, useState } from 'react'
import Button from '../Button'

function AddFriendMain() {
    const [userName, setUserName] = useState('')
    const userNameRef = useRef()

    const handleSubmit = e => {
        e.preventDefault()
    }

    return (
        <div className='add-friend-add'>
            <form onSubmit={handleSubmit}>
                <div className="form__input-wrapper">
                    <input
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        ref={userNameRef}
                        className="form__input"
                    />
                </div>
                {
                    // emailError &&
                    // <span
                    //     className="form__error-message"
                    // >
                    //     {emailError}
                    // </span>
                }
                <div className="form__btn-wrapper">
                    <Button>send request</Button>
                </div>
            </form>
        </div>
    )
}

export default AddFriendMain