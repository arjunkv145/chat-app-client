import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AddFriendOptions from '../components/addFriend/AddFriendOptions'

function AddFriend() {
    const location = useLocation()
    const navigate = useNavigate()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const options = [
        { id: 1, link: 'add', description: 'Send request' },
        { id: 2, link: 'pending', description: 'Pending' },
        { id: 3, link: 'friends', description: 'Friends' },
    ]

    useEffect(() => {
        window.addEventListener('resize', () => setWindowWidth(window.innerWidth))

        return () => {
            window.removeEventListener('resize', () => setWindowWidth(window.innerWidth))
        }
    }, [])

    useEffect(() => {
        if (windowWidth > 560) {
            if (location.pathname === '/addfriend' || location.pathname === '/addfriend/') {
                navigate('/addfriend/add', { replace: true })
            }
        }
    }, [location.pathname, navigate, windowWidth])

    return (
        <main className="add-friend main-resizable">
            <section
                className='main-resizable__left'
            >
                <h1 className='add-friend__title'>Add Friend</h1>
                <div className='add-friend__options'>
                    <AddFriendOptions options={options} />
                </div>
            </section>
            <section
                className={
                    (location.pathname === '/addfriend' || location.pathname === '/addfriend/') ?
                        'main-resizable__right hide' :
                        'main-resizable__right'
                }
            >
                <Outlet />
            </section>
        </main>
    )
}

export default AddFriend