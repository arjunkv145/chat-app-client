import React from 'react'
import { Bolt, Add, Public, Settings, Diversity2 } from '@mui/icons-material'
import CustomNavLink from './CustomNavLink'

function Navbar() {
    return (
        <nav className='nav'>
            <ul className='nav__list'>
                <li className='nav__list-item'>
                    <CustomNavLink
                        to='/chat'
                        className={({ isActive }) => isActive ? "nav__link active" : "nav__link"}
                    >
                        <span className='nav__icon'>
                            <Bolt />
                        </span>
                    </CustomNavLink>
                    <span className='nav__tooltip'>Chat</span>
                </li>
                <li className='nav__list-item'>
                    <CustomNavLink
                        to='/group'
                        className={({ isActive }) => isActive ? "nav__link active" : "nav__link"}
                    >
                        <span className='nav__icon'>
                            <Diversity2 />
                        </span>
                    </CustomNavLink>
                    <span className='nav__tooltip'>Group</span>
                </li>
                <li className='nav__list-item'>
                    <CustomNavLink
                        to='/public-group'
                        className={({ isActive }) => isActive ? "nav__link active" : "nav__link"}
                    >
                        <span className='nav__icon'>
                            <Public />
                        </span>
                    </CustomNavLink>
                    <span className='nav__tooltip'>Public group</span>
                </li>
                <li className='nav__list-item'>
                    <CustomNavLink
                        to='/add-friend'
                        className={({ isActive }) => isActive ? "nav__link active" : "nav__link"}
                    >
                        <span className='nav__icon'>
                            <Add />
                        </span>
                    </CustomNavLink>
                    <span className='nav__tooltip'>Add friend</span>
                </li>
                <li className='nav__list-item'>
                    <CustomNavLink
                        to='/settings'
                        className={({ isActive }) => isActive ? "nav__link active" : "nav__link"}
                    >
                        <span className='nav__icon'>
                            <Settings />
                        </span>
                    </CustomNavLink>
                    <span className='nav__tooltip'>Settings</span>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar