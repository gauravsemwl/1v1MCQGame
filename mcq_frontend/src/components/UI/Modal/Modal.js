import React from 'react'
import './Modal.css'

const Modal = ({ children }) => {


    return (
        <div className='backdrop' >
            <div className='modal'>{children}</div>
        </div >
    )

}

export default Modal