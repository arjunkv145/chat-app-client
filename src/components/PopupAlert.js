import React from 'react'

function PopupAlert(props) {
    const { openPopupAlert, setOpenPopupAlert, title, body } = props

    return (
        <div className={`popup-alert-background ${openPopupAlert && 'open'}`} onClick={() => setOpenPopupAlert(false)}>
            <div className={`popup-alert ${openPopupAlert && 'open'}`} onClick={e => e.stopPropagation()}>
                <div className="popup-alert__title">{title}</div>
                <div className="popup-alert__body">
                    {body}
                </div>
                <button className='btn' onClick={() => setOpenPopupAlert(false)}>close</button>
            </div>
        </div>
    )
}

export default PopupAlert