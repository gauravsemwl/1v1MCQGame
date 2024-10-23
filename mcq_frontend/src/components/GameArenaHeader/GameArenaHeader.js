import React from 'react'
import './GameArenaHeader.css'

const GameArenaHeader = ({ yourName, gameName, opponentName, timer }) => {
    return (
        <div className='arena-header'>
            <div className='player-box'>
                <img src='/player1.jpg' style={{ display: 'flex', width: '100px', height: '100px', borderRadius: '15px' }}></img>
                <p className='name1-container'>{yourName}</p>
            </div>
            <div className='arena-game-name'>
                <div>
                    {gameName}
                </div>
                <div style={{ position: 'relative', fontSize: '20px', fontFamily: 'valorax', padding: '10px', bottom: '-15px', color: 'rgba(200,200,200)' }}>
                    {timer ? timer : 0}
                </div>
            </div>
            <div className='player-box'>
                <img src='/player2.jpg' style={{ display: 'flex', width: '100px', height: '100px', borderRadius: '15px' }}></img>
                <p className='name2-container'>{opponentName}</p>
            </div>
        </div>
    )
}

export default GameArenaHeader