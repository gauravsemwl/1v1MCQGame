import React from 'react'
import './Header.css'

const Header = () => {
    return (
        <div className='header'>
            <h1>1v1 MCQ</h1>
            <div>
                <button className='header-button'
                    style={{ margin: '20px' }}
                >ABOUT</button>
                <button className='header-button'>RULES</button>
            </div>
        </div>
    )
}

export default Header