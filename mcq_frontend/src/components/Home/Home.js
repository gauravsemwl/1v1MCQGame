import React from 'react'
import './Home.css'
import MCQMenu from '../MCQMenu/MCQMenu'
import StartGame from '../StartGame/StartGame'
import Games from '../Games/Games'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const Home = () => {
    const [showMCQMenu, setShowMCQMenu] = useState(false)
    const [showStartGameMenu, setShowStartGameMenu] = useState(false)
    const [showGames, setShowGames] = useState(false)

    const Navigate = useNavigate()

    const login = localStorage.getItem('userInfo') ? true : false

    useEffect(() => {
        console.log(window.innerWidth, window.innerHeight)
        if (!login) {
            Navigate('/')
        }
    }, [])

    const handleManageMCQs = () => {
        if (showMCQMenu) {
            setShowMCQMenu(false)
            return
        }
        setShowMCQMenu(true)
    }

    const handleStartGame = () => {
        if (showStartGameMenu) {
            setShowStartGameMenu(false)
            return
        }
        setShowStartGameMenu(true)
    }

    const handleShowGames = () => {
        if (showGames) {
            setShowGames(false)
            return
        }
        setShowGames(true)

    }


    return (
        <div className='home-container'>
            <div className='home-container-inside'>
                <div className='home-buttons'>
                    <p className='home-button' onClick={handleStartGame} style={{ color: 'red' }}>START NEW GAME</p>
                    <p className='home-button' onClick={handleShowGames} style={{ color: 'white' }} > JOIN A GAME</p>
                    <p className='home-button' style={{ color: 'white' }} >PLAY AGAINST BOT</p>
                    <p className='home-button' onClick={handleManageMCQs} style={{ color: 'white' }} >MANAGE YOUR MCQ</p>
                    {showMCQMenu && <MCQMenu showMCQMenu={showMCQMenu} handleShowMCQMenu={handleManageMCQs} />}
                    {showStartGameMenu && <StartGame showStartGameMenu={showStartGameMenu} handleStartGame={handleStartGame}></StartGame>}
                    {showGames && <Games showGames={showGames} handleShowGames={handleShowGames}></Games>}
                </div>
            </div>
        </div >
    )
}

export default Home