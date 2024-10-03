
import React from 'react'
import './MCQView.css'

const MCQView = ({ mcq, handleClickEdit, handleClickDelete }) => {
    return (
        <div className='mcq-container'>
            <div className='question-container'>
                <div style={{ display: 'inline', paddingTop: '3px' }}>Q.&nbsp;</div>
                <div className='question-view'>{mcq.question}</div>
            </div>
            <div className='options-container'>
                <ul style={{ padding: '0px 20px', margin: '5px 0px', listStyleType: 'decimal' }} >
                    {mcq.options.map((option, index) => {
                        return (
                            <li key={index} className='option-container'>
                                <div className='option-view'>{option}</div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className='mcq-buttons-container'>
                <div>
                    <div style={{ display: 'inline' }}>Answer.</div>
                    <div className='answer-view'>{mcq.answer}</div>
                </div>
                <div className='mcq-buttons'>
                    <button className='mcq-button' onClick={() => { handleClickEdit(mcq._id); }}>edit</button>
                    <button className='mcq-button' onClick={() => { handleClickDelete(mcq._id) }}>delete</button>
                </div>
            </div>
        </div>
    )
}

export default MCQView