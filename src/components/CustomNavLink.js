import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function CustomNavLink(props) {
    const location = useLocation()
    const checkIfSameLink = e => {
        if (props.to === location.pathname) {
            e.preventDefault()
        }
    }

    return (
        <NavLink onClick={checkIfSameLink} {...props}>{props.children}</NavLink>
    )
}

export default CustomNavLink