import React from 'react'
import './RequestNotification.css'

const RequestNotification = ({ children, value, handleRequestAccept, handleRequestDecline }) => {
    return (
        <div className='notification-backdrop'>
            <div className='notification-container' onClick={(e) => e.stopPropagation()}>
                <div>{`${value.fromUserGameName} has requested to join your game "${value.game}"`}</div>
                <div>
                    <button onClick={() => handleRequestAccept(value)}>YES</button>
                    <button onClick={() => handleRequestDecline(value)}>NO</button>
                </div>
            </div>
        </div >
    )

}

export default RequestNotification