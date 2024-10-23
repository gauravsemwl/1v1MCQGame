import React, { useContext } from 'react'
import './Score.css'
import cx from 'classnames'
import AppContext from '../../store/app-context'
const Score = ({ score, player }) => {
    const { userInfo } = useContext(AppContext)
    return (
        <div className='score-container'>
            <p className={cx('score', { ['player1']: player === 1, ['player2']: player === 2 })}>{score}</p>
        </div>
    )
}

export default Score