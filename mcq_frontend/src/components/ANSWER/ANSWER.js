import React, { useContext } from 'react'
import MCQAnswer from '../MCQAnswer/MCQAnswer.js'
import AppContext from '../../store/app-context'

const ANSWER = ({ mcq, currentTurn, answer, handleChangeAnswer }) => {

    const { userInfo } = useContext(AppContext)

    if (currentTurn !== userInfo._id) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <p style={{ display: 'flex', justifyContent: 'center', padding: '120px 0px', fontFamily: 'supreme', width: '510px', textAlign: 'center', fontSize: '30px', color: 'rgba(200,200,200)' }}>
                    Waiting for answer from the opponent...
                </p>
            </div>
        )
    }
    return (
        <div>
            <MCQAnswer mcq={mcq} answer={answer} handleChangeAnswer={handleChangeAnswer}></MCQAnswer>
        </div>
    )
}

export default ANSWER