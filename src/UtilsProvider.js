import { createContext, useEffect } from "react"

const UtilsContext = createContext()

function SocketProvider(props) {
    const { auth } = useAuth()
    const { openPopupAlert, setOpenPopupAlert, title, body } = props

    return (
        <UtilsContext.Provider value={socket}>
            {props.children}
            <div className={`popup-alert-background ${openPopupAlert && 'open'}`} onClick={() => setOpenPopupAlert(false)}>
                <div className={`popup-alert ${openPopupAlert && 'open'}`} onClick={e => e.stopPropagation()}>
                    <div className="popup-alert__title">{title}</div>
                    <div className="popup-alert__body">
                        {body}
                    </div>
                    <button className='btn' onClick={() => setOpenPopupAlert(false)}>close</button>
                </div>
            </div>
        </UtilsContext.Provider>
    );
}

export default SocketProvider
export { UtilsContext }