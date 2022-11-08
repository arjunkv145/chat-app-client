import React from 'react'
import { Bolt, Add, Public, Settings, Diversity2 } from '@mui/icons-material'
import CustomNavLink from './CustomNavLink'

function Navbar() {
    return (
        <nav className='nav-container'>
            <ul className='nav'>
                <li className='nav-item'>
                    <CustomNavLink
                        to='/chat'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Bolt />
                        </span>
                    </CustomNavLink>
                    <span className='nav-tooltip'>Chat</span>
                </li>
                <li className='nav-item'>
                    <CustomNavLink
                        to='/group'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Diversity2 />
                        </span>
                    </CustomNavLink>
                    <span className='nav-tooltip'>Group</span>
                </li>
                <li className='nav-item'>
                    <CustomNavLink
                        to='/publicgroup'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Public />
                        </span>
                    </CustomNavLink>
                    <span className='nav-tooltip'>Public group</span>
                </li>
                <li className='nav-item'>
                    <CustomNavLink
                        to='/addfriend'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Add />
                        </span>
                    </CustomNavLink>
                    <span className='nav-tooltip'>Add friend</span>
                </li>
                <li className='nav-item'>
                    <CustomNavLink
                        to='/settings'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Settings />
                        </span>
                    </CustomNavLink>
                    <span className='nav-tooltip'>Settings</span>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar