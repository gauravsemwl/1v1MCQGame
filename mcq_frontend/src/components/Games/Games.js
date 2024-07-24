import React from 'react'
import Modal from '../UI/Modal/Modal'
import socket from '../../connection/socket.js'



const Games = () => {
    socket.on('conn', (data) => {
        console.log(data)
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        const createGame = async () => {
            await fetch("http://localhost:5000/games", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                })
            })
        }
        createGame()
    }
    return (
        <Modal>
            <form onSubmit={handleSubmit}>
                <label for='gamename'>Game-Name</label>
                <input
                    id='gamename'
                    type='text'
                ></input>
                <button type='submit'>Start</button>
            </form>
        </Modal>
    )
}

export default Games