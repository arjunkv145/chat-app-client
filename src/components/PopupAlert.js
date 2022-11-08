import React from 'react'
import Button from './Button'

function PopupAlert(props) {
    const { openPopupAlert, setOpenPopupAlert, title, body } = props

    return (
        <div className={`popup-alert-screen ${openPopupAlert && 'open'}`} onClick={() => setOpenPopupAlert(false)}>
            <div className={`popup-alert ${openPopupAlert && 'open'}`} onClick={e => e.stopPropagation()}>
                <div className="popup-alert__title">{title}</div>
                <div className="popup-alert__body">
                    {body}
                </div>
                <Button onClick={() => setOpenPopupAlert(false)}>close</Button>
            </div>
        </div>
    )
}

export default PopupAlert