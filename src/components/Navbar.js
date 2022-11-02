import React from 'react'
import './sassStyles/navbar.scss'
import { Bolt, Add, Public, Settings, Diversity2 } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className='nav-container'>
            <ul className='nav'>
                <li className='nav-item'>
                    <Link to='/chat' className='nav-link'>
                        <span className='nav-icon'>
                            <Bolt />
                        </span>
                    </Link>
                    <span className='nav-tooltip'>Chat</span>
                </li>
                <li className='nav-item'>
                    <Link to='/group' className='nav-link'>
                        <span className='nav-icon'>
                            <Diversity2 />
                        </span>
                    </Link>
                    <span className='nav-tooltip'>Group</span>
                </li>
                <li className='nav-item'>
                    <Link to='/chat' className='nav-link'>
                        <span className='nav-icon'>
                            <Public />
                        </span>
                    </Link>
                    <span className='nav-tooltip'>Public group</span>
                </li>
                <li className='nav-item'>
                    <Link to='/chat' className='nav-link'>
                        <span className='nav-icon'>
                            <Add />
                        </span>
                    </Link>
                    <span className='nav-tooltip'>Add friend</span>
                </li>
                <li className='nav-item'>
                    <Link to='/chat' className='nav-link'>
                        <span className='nav-icon'>
                            <Settings />
                        </span>
                    </Link>
                    <span className='nav-tooltip'>Settings</span>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar