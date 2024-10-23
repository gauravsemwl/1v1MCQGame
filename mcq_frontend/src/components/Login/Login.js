import React from 'react'

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AppContext from '../../store/app-context'


const Login = () => {
    const [GameName, setGameName] = useState("")
    const [Password, setPassword] = useState("")
    const [GameNameError, setGameNameError] = useState("")
    const [PasswordError, setPasswordError] = useState("")

    const Navigate = useNavigate()
    const { login, handleLogin } = useContext(AppContext)


    useEffect(() => {
        if (login) {
            Navigate('/home')
        }
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (GameName.length == 0) {
            setGameNameError('Enter Game Name')
            return
        }

        if (Password.length < 7) {
            setPasswordError('minimum length : 7')
            return
        }

        const UserInfo = {
            gameName: GameName,
            password: Password
        }
        try {
            const res = await fetch('/users/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(UserInfo),
            })

            if (!res.ok) {
                const error = await res.json()
                if (error.code === 11000) {
                    setGameNameError('Username not availaible')
                }
                else {
                    setGameNameError('cant save')
                }
                return
            }
            const result = await res.json()
            handleLogin(JSON.stringify(result))
            Navigate('/home')
        }
        catch (e) {
            console.log(e)
        }
    }

    const onPasswordChange = (e) => {
        const currPassword = e.target.value
        setPassword(currPassword)
        setPasswordError("")
    }


    const onGamenameChange = (e) => {
        const currGameName = e.target.value
        setGameName(currGameName)
        setGameNameError("")
    }
    return (
        <>
            <div className='container'>
                <div>
                    <h1 className='title-sign'>LOGIN</h1>
                </div>
                <div className='signup-container'>
                    <form onSubmit={handleSubmit} className='signup-form'>
                        <div className='input-container'>
                            <div className='gamename-error-message'>{GameNameError}</div>
                            <div className='input-container-inside'>
                                <label htmlFor="gamename" className='label'>GAME-NAME</label>
                                <input
                                    id="gamename"
                                    type="text"
                                    name="gamename"
                                    placeholder='e.g. Smoke07'
                                    value={GameName}
                                    onChange={onGamenameChange}
                                    className='input-sign'
                                ></input>
                            </div>
                        </div>
                        <div className='input-container'>
                            <div className='gamename-error-message'>{PasswordError}</div>
                            <div className='input-container-inside'>
                                <label htmlFor="password">PASSWORD</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder='password'
                                    value={Password}
                                    onChange={onPasswordChange}
                                    className='input-sign'
                                ></input></div>
                            {/* <div className='gamename-error-message'>csdcsd</div> */}
                        </div>
                        <div className='single-button-container'>
                            <button className='signup-button' type='submit'>Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
            <div style={{
                position: 'relative',
                fontFamily: 'supreme',
                color: 'white',
                bottom: '90px',
                justifyContent: 'center',
                display: 'flex',
                fontSize: '20px'
            }}>
                Don't have an account <a style={{
                    cursor: 'pointer',
                    marginLeft: '10px',
                    color: 'rgba(100,300,100)',
                    fontSize: '20px'
                }} onClick={() => { Navigate('/') }}>signup</a>
            </div>
        </>
    )
}

export default Login