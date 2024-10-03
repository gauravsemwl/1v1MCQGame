import React, { useContext } from 'react'
import MCQAsk from '../MCQAsk/MCQAsk'
import AppContext from '../../store/app-context'
import Choose from '../Choose/Choose'

const ASK = ({ chooseAndAsk, currentTurn, handleAskQuestion, handleAskOptions, handleAskAnswer, askQuestion, askOptions, askAnswer, questionRef, optionsRef, answerRef, handleAsk }) => {

    const { userInfo } = useContext(AppContext)

    if (currentTurn !== userInfo._id) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <p style={{ display: 'flex', justifyContent: 'center', padding: '120px 0px', fontFamily: 'supreme', width: '510px', textAlign: 'center', fontSize: '30px', color: 'rgba(200,200,200)' }}>
                    Waiting for question from the opponent...
                </p>
            </div>
        )
    }
    if (chooseAndAsk === true) {
        return <Choose handleChooseAndAsk={handleAsk}></Choose>
    }
    return (
        <div>
            <MCQAsk
                handleAskQuestion={handleAskQuestion}
                handleAskOptions={handleAskOptions}
                handleAskAnswer={handleAskAnswer}
                askQuestion={askQuestion}
                askOptions={askOptions}
                askAnswer={askAnswer}
                questionRef={questionRef}
                optionsRef={optionsRef}
                answerRef={answerRef}
            ></MCQAsk>
        </div>
    )
}

export default ASK