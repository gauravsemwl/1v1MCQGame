import React from 'react'

const Countdown = ({ count }) => {
    return (
        <div className='notification-backdrop'>
            <div className='notification-container' onClick={(e) => e.stopPropagation()}>
                <div>{`the game will start in ${count} ${count > 1 ? "seconds" : "second"}`}</div>
            </div>
        </div >
    )
}

export default Countdown