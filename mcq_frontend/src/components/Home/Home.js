import React, { useContext } from 'react'
import './Home.css'
import MCQMenu from '../MCQMenu/MCQMenu'
import StartGame from '../StartGame/StartGame'
import Games from '../Games/Games'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppContext from '../../store/app-context'
const Home = () => {
    const [showMCQMenu, setShowMCQMenu] = useState(false)
    const [showStartGameMenu, setShowStartGameMenu] = useState(false)
    const [showGames, setShowGames] = useState(false)

    const Navigate = useNavigate()

    const { login, logout } = useContext(AppContext)

    useEffect(() => {
        console.log(window.innerWidth, window.innerHeight)
        if (!login) {
            Navigate('/')
        }
    }, [login])

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

    const handleLogout = async () => {
        try {
            const res = await fetch('/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!res.ok) {
                throw new Error('could not log out')
            }

            logout()

        }
        catch (e) {

        }
    }


    return (
        <div className='home-container'>
            <div className='home-container-inside'>
                <div className='home-buttons'>
                    <p className='home-button' onClick={handleStartGame} style={{ color: 'red' }}>START NEW GAME</p>
                    <p className='home-button' onClick={handleShowGames} style={{ color: 'white' }} > JOIN A GAME</p>
                    <p className='home-button' onClick={handleManageMCQs} style={{ color: 'white' }} >MANAGE YOUR MCQ</p>
                    <p className='home-button' onClick={handleLogout} style={{ color: 'white' }} >LOG-OUT</p>
                    {showMCQMenu && <MCQMenu showMCQMenu={showMCQMenu} handleShowMCQMenu={handleManageMCQs} />}
                    {showStartGameMenu && <StartGame showStartGameMenu={showStartGameMenu} handleStartGame={handleStartGame}></StartGame>}
                    {showGames && <Games showGames={showGames} handleShowGames={handleShowGames}></Games>}
                </div>
            </div>
        </div >
    )
}

export default Home