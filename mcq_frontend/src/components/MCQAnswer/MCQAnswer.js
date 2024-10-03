
import React, { useState } from 'react'
import cx from 'classnames'
import './MCQAnswer.css'

const MCQAnswer = ({ mcq, answer, handleChangeAnswer }) => {

    return (
        <div className='mcq-container' style={{ backgroundColor: 'rgba(200, 200, 200,0.9)' }}>
            <div className='question-container'>
                <div style={{ display: 'inline', paddingTop: '0px', fontFamily: 'supreme', fontSize: '25px', fontWeight: '550' }}>Q.</div>
                <div
                    className='question-view'
                >{mcq.question}</div>
            </div>
            <div className='options-container'>
                <ul style={{ padding: '0px 10px 0px 20px', margin: '5px 0px', listStyleType: 'decimal', fontSize: '22px', fontWeight: '550', fontFamily: 'supreme' }} >

                    {mcq.options.map((option, index) => {
                        return (
                            <li key={index} className='option-container'>
                                <div
                                    style={{ cursor: 'pointer', paddingTop: '5px' }}
                                    className={cx('option-view', { ['active-option']: answer === index })}
                                    onClick={() => {
                                        handleChangeAnswer(index)
                                    }}
                                >
                                    {option}
                                </div>

                            </li>


                        )
                    })}

                </ul>
            </div>
        </div>
    )
}

export default MCQAnswer