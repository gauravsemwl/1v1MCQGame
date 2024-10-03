import React from 'react'
import Modal from '../UI/Modal/Modal.js'
import AppContext from '../../store/app-context.js'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GAME_STATE } from '../../constants.js'
import './StartGame.css'




const StartGame = ({ showStartGameMenu, handleStartGame }) => {
    const { login, pusher } = useContext(AppContext)
    const [gameName, setGameName] = useState('')
    const Navigate = useNavigate()

    if (!login) {
        Navigate('/')
    }

    useEffect(() => {

    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const createGame = async () => {
            try {
                const res = await fetch('/games', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: gameName,
                        player1: JSON.parse(localStorage.getItem('userInfo'))._id,
                        state: GAME_STATE.NOT_INITIALIZED,
                        currentTurn: JSON.parse(localStorage.getItem('userInfo'))._id
                    })
                })

                if (!res.ok) {
                    throw new Error('Game Start Failed')
                }

                const game = await res.json()
                const gameChannel = pusher.subscribe(`presence-${game._id}`)

                gameChannel.bind('pusher:subscription_succeeded', () => {
                    Navigate(`/home/${game._id}`)
                })

            }
            catch (e) {
                console.log(e)
            }
        }

        createGame()
    }
    return (
        <Modal show={showStartGameMenu} handleShow={handleStartGame} backGround='rgba(200, 200, 200)'>
            <form onSubmit={handleSubmit} className='start-form'>
                <label className='name-label'>NAME</label>
                <input
                    className='game-name'
                    id='gamename'
                    type='text'
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                ></input>

                <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', margin: '0px 0px' }}>
                    <button className='game-start-button' type='submit'>Start</button>
                </div>
            </form>
        </Modal>
    )
}

export default StartGame