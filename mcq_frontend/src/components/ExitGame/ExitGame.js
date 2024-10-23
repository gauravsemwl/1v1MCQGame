import React from 'react'

const ExitGame = ({ handleExitAccept, handleExitDecline }) => {
    return (
        <div className='notification-backdrop'>
            <div className='notification-container' onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <p style={{ display: 'flex', justifyContent: 'center', padding: '0px 0px', fontFamily: 'supreme', width: '410px', textAlign: 'center', fontSize: '20px', color: 'rgba(0, 0, 0,0.6)' }}>
                        are you sure you want to quit the game
                    </p>
                </div>
                {/* <div className='notification-content-container'><p>{`${value.fromUserGameName} has requested to join your game "${value.game}"`}</p></div> */}
                <div className='notification-button-container' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className='notification-button' onClick={handleExitAccept}>YES</button>
                    <button className='notification-button' onClick={handleExitDecline}>NO</button>
                </div>
            </div>
        </div >
    )
}

export default ExitGame