import React from 'react'
import CustomNavLink from '../CustomNavLink'

function Navbar() {
    return (
        <nav className='add-friend-nav'>
            <ul className='list'>
                <li className='list-item'>
                    <CustomNavLink
                        to='/add-friend/add'
                        className={({ isActive }) => isActive ? "link active" : "link"}
                    >
                        Send request
                    </CustomNavLink>
                </li>
                <li className='list-item'>
                    <CustomNavLink
                        to='/add-friend/pending'
                        className={({ isActive }) => isActive ? "link active" : "link"}
                    >
                        Pending
                    </CustomNavLink>
                </li>
                <li className='list-item'>
                    <CustomNavLink
                        to='/add-friend/friends'
                        className={({ isActive }) => isActive ? "link active" : "link"}
                    >
                        Friends
                    </CustomNavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar