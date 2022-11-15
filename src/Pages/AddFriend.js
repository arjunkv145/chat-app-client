import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AddFriendNavbar from '../components/addFriend/Navbar'

function AddFriend() {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.pathname === '/add-friend' || location.pathname === '/add-friend/') {
            navigate('/add-friend/add', { replace: true })
        }
    }, [location.pathname, navigate])

    return (
        <main className="add-friend">
            <div className='add-friend__nav'>
                <AddFriendNavbar />
            </div>
            <section
                className='add-friend__body'
            >
                <Outlet />
            </section>
        </main>
    )
}

export default AddFriend