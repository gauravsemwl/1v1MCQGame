import React from 'react'
import './Signup.css'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AppContext from '../../store/app-context'


const Signup = () => {
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
  }, [login])



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
      const res = await fetch('/users', {
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
          <h1 className='title-sign'>CREATE NEW ACCOUNT</h1>
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
              <button className='signup-button' type='submit'>Sign Up</button>
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
        Already have an account <a style={{
          cursor: 'pointer',
          marginLeft: '10px',
          color: 'rgba(100,300,100)',
          fontSize: '20px'
        }} onClick={() => { Navigate('/signin') }}>login</a>
      </div>
    </>
  )
}

export default Signup