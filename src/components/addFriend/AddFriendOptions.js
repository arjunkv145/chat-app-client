import React from 'react'
import CustomNavLink from '../CustomNavLink'

function AddFriendOptions({ options }) {
    return (
        <div className='add-friend-options'>
            {
                options.map(option => (
                    <CustomNavLink
                        to={`/addfriend/` + option.link}
                        key={option.id}
                        className={
                            ({ isActive }) => isActive ?
                                'add-friend-options__link active' :
                                'add-friend-options__link'
                        }
                    >
                        <div className='add-friend-options__option'>
                            {option.description}
                        </div>
                    </CustomNavLink>
                ))
            }
        </div>
    )
}

export default AddFriendOptions