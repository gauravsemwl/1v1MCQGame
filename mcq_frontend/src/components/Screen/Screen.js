import React from 'react'
import './Screen.css'

const Screen = ({ children }) => {
    return (

        <div className='screen-container'>
            {children}
        </div>


    )
}

export default Screen