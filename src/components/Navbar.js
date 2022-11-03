import React from 'react'
import './sassStyles/navbar.scss'
import { Bolt, Add, Public, Settings, Diversity2 } from '@mui/icons-material'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <nav className='nav-container'>
            <ul className='nav'>
                <li className='nav-item'>
                    <NavLink
                        to='/chat'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Bolt />
                        </span>
                    </NavLink>
                    <span className='nav-tooltip'>Chat</span>
                </li>
                <li className='nav-item'>
                    <NavLink
                        to='/group'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Diversity2 />
                        </span>
                    </NavLink>
                    <span className='nav-tooltip'>Group</span>
                </li>
                <li className='nav-item'>
                    <NavLink
                        to='/publicgroup'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Public />
                        </span>
                    </NavLink>
                    <span className='nav-tooltip'>Public group</span>
                </li>
                <li className='nav-item'>
                    <NavLink
                        to='/addfriend'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Add />
                        </span>
                    </NavLink>
                    <span className='nav-tooltip'>Add friend</span>
                </li>
                <li className='nav-item'>
                    <NavLink
                        to='/settings'
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className='nav-icon'>
                            <Settings />
                        </span>
                    </NavLink>
                    <span className='nav-tooltip'>Settings</span>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar