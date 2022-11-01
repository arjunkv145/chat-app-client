import React from 'react'
import './sassStyles/popupAlert.scss'
import Button from './Button'

function PopupAlert(props) {
    const { openPopupAlert, setOpenPopupAlert, title, body } = props

    return (
        <div className={`popup-container ${openPopupAlert && 'open'}`} onClick={() => setOpenPopupAlert(false)}>
            <div className={`popup ${openPopupAlert && 'open'}`} onClick={e => e.stopPropagation()}>
                <div className="popup-title">{title}</div>
                <div className="popup-body">
                    {body}
                </div>
                <Button onClick={() => setOpenPopupAlert(false)}>close</Button>
            </div>
        </div>
    )
}

export default PopupAlert