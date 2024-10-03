import React from 'react'
import './Modal.css'

const Modal = ({ show, handleShow, children, backGround }) => {
    if (!show) {
        return null
    }

    return (
        <div className='backdrop' onClick={handleShow}>
            <div style={{ backgroundColor: backGround }} className='modal' onClick={(e) => e.stopPropagation()}>{children}</div>
        </div >
    )

}

export default Modal