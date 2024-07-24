import React from 'react'
import './Home.css'
import { Outlet } from 'react-router-dom'

const Home = () => {
    return (
        <div className='home-container'>
            <div className='home-container-inside'>
                <div className='home-buttons'>
                    <button className='home-button'>Start new Game</button>
                    <button className='home-button'>Join a game</button>
                    <button className='home-button'>Play Against Bot</button>
                    <button className='home-button'>Manage Your MCQs</button>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Home