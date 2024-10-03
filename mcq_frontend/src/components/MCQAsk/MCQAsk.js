import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

const MCQAsk = ({ handleAskQuestion, handleAskOptions, handleAskAnswer, askQuestion, askOptions, askAnswer, questionRef, optionsRef, answerRef }) => {

    // const questionRef = useRef(null)
    // const optionsRef = useRef([])
    // const answerRef = useRef(null)

    useEffect(() => {
        questionRef.current.textContent = askQuestion;
    }, [questionRef, askQuestion])

    useEffect(() => {
        optionsRef.current.forEach((el, i) => {
            if (i < askOptions.length) {
                el.textContent = askOptions[i]
            }
        });
    }, [optionsRef, askOptions])

    useEffect(() => {
        answerRef.current.textContent = askAnswer;
    }, [answerRef, askAnswer])


    const handleEditQuestion = (e) => {
        handleAskQuestion(e.target.textContent)
    };

    const handleEditOption = (e, index) => {
        const newOptions = [...askOptions]
        newOptions[index] = e.target.textContent
        handleAskOptions(newOptions, index);
    }

    const handleDeleteOption = (index) => {
        let newOptions = [...askOptions]
        newOptions = newOptions.filter((_, i) => {
            return (i !== index)
        })
        handleAskOptions(newOptions)
    }

    const handleAddOption = () => {
        let newOptions = [...askOptions]
        newOptions = newOptions.concat("")
        handleAskOptions(newOptions)
    }

    return (

        <div className='mcq-container' style={{ backgroundColor: 'rgba(200, 200, 200,0.9)' }}>
            <div className='question-container'>
                <div style={{ display: 'inline', paddingTop: '0px', fontFamily: 'supreme', fontSize: '25px', fontWeight: '550' }}>Q.</div>
                <div
                    ref={questionRef}
                    contenteditable='true'
                    className='question-edit'
                    onInput={(e) => { handleEditQuestion(e) }}
                ></div>
            </div>
            <div className='options-container'>
                <ul style={{ padding: '0px 10px 0px 20px', margin: '5px 0px', listStyleType: 'decimal', fontSize: '22px', fontWeight: '550', fontFamily: 'supreme' }} >

                    {askOptions.map((option, index) => {
                        return (
                            <li key={index} className='option-container fade'>
                                <div
                                    ref={(el) => { optionsRef.current[index] = el }}
                                    contenteditable='true'
                                    className='option-edit'
                                    onInput={(e) => { handleEditOption(e, index) }}
                                >
                                </div>
                                <CSSTransition
                                    in={true}
                                    timeout={200}
                                    classNames="fade"
                                    unmountOnExit

                                >
                                    <i class="fa fa-trash fade" aria-hidden="true" onClick={() => { handleDeleteOption(index); }} style={{ fontSize: '15px', display: 'inline', paddingLeft: '15px', m: '30px', cursor: 'pointer', width: '100px' }}></i>
                                </CSSTransition>

                            </li>


                        )
                    })}

                </ul>
            </div>

            <div className='mcq-buttons-container'>
                <div>
                    <div style={{ display: 'inline', fontWeight: '550', fontFamily: 'supreme', fontSize: '20px', paddingTop: '6px' }}>ANS.</div>
                    <div
                        ref={answerRef}
                        className='answer-edit'
                        contenteditable='true'
                        onInput={(e) => {
                            handleAskAnswer(e.target.textContent)
                        }}
                    ></div>
                </div>
                <div>
                    <div className='mcq-buttons'>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '170px', height: '10px' }}>
                            <button className='mcq-button' onClick={handleAddOption}>add option</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        // <div className='mcq-container'>
        //     <div className='question-container'>
        //         <div style={{ display: 'inline' }}>Q. </div>
        //         <input
        //             className='question-edit'
        //             value={editQuestion}
        //             onChange={(e) => { setEditQuestion(e.target.value) }}
        //         ></input>
        //     </div>
        //     <div className='options-container'>
        //         <ul style={{ padding: '0px 10px 0px 20px', margin: '5px 0px', listStyleType: 'decimal' }} >
        //             {editOptions.map((option, index) => {
        //                 return (
        //                     <li key={index} className='option-container'>
        //                         <input
        //                             className='option-edit'
        //                             value={editOptions[index]}
        //                             onChange={(e) => { handleEditOption(e, index) }}
        //                         ></input>
        //                         <button className='delete-option' onClick={() => { handleDeleteOption(index); }}>delete</button>
        //                     </li>
        //                 )
        //             })}
        //         </ul>
        //     </div>

        //     <div className='mcq-edit-buttons-container'>
        //         <div>
        //             <div style={{ display: 'inline' }}>Answer.</div>
        //             <input
        //                 className='answer-edit'
        //                 value={editAnswer}
        //                 onChange={(e) => { setEditAnswer(e.target.value) }}
        //             ></input>
        //         </div>
        //         <div className='mcq-edit-buttons'>
        //             <button className='mcq-edit-button' onClick={handleAddOption}>add option</button>
        //             <button className='mcq-edit-button' onClick={() => { handleAsk(editQuestion, editOptions, editAnswer) }}>Ask</button>
        //             <button className='mcq-edit-button' onClick={() => { handleSaveandAsk(editQuestion, editOptions, editAnswer) }}>Save and Ask</button>
        //         </div>
        //     </div>
        // </div>
    )
}

export default MCQAsk
