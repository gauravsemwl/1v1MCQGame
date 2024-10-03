import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Reorder, AnimatePresence } from 'framer-motion'
import cx from 'classnames'
import './MCQEdit.css'

const MCQEdit = ({ mcq, handleCancel, handleSave, isEditID, handleClickEdit, handleClickDelete, chooseAndAsk, handleChooseAndAsk }) => {
    const [editQuestion, setEditQuestion] = useState(mcq.question)
    const [editOptions, setEditOptions] = useState(mcq.options)
    const [editAnswer, setEditAnswer] = useState(mcq.answer)

    const questionRef = useRef(null)
    const optionsRef = useRef([])
    const answerRef = useRef(null)


    useEffect(() => {
        questionRef.current.textContent = editQuestion;
    }, [questionRef, editQuestion])

    useEffect(() => {
        optionsRef.current.forEach((el, i) => {
            if (i < editOptions.length) {
                el.textContent = editOptions[i]
            }
        });
    }, [optionsRef, editOptions])

    useEffect(() => {
        answerRef.current.textContent = editAnswer;
    }, [editAnswer])


    const handleEditQuestion = (e) => {
        setEditQuestion(e.target.textContent)
        questionRef.current.classList.remove('invalid')
    };

    const handleEditOption = (e, index) => {
        const newOptions = [...editOptions]
        newOptions[index] = e.target.textContent
        setEditOptions(newOptions)
        optionsRef.current[index].classList.remove('invalid')
    }

    const handleDeleteOption = (index) => {
        let newOptions = [...editOptions]
        newOptions = newOptions.filter((_, i) => {
            return (i !== index)
        })
        setEditOptions(newOptions)
    }

    const handleAddOption = () => {
        let newOptions = [...editOptions]
        newOptions = newOptions.concat("")
        setEditOptions(newOptions)
    }

    return (
        <CSSTransition
            appear
            in={true}
            timeout={200}
            classNames="fade"
            unmountOnExit

        >
            <div className={cx('mcq-container', { ['mcq-choose']: chooseAndAsk === true })} >
                <div className='question-container'>
                    <div style={{ display: 'inline', paddingTop: '0px', fontFamily: 'supreme', fontSize: '25px', fontWeight: '550' }}>Q.</div>
                    <div
                        ref={questionRef}
                        contenteditable={isEditID === mcq._id ? "true" : "false"}
                        className={cx({ ['question-edit']: isEditID === mcq._id, ['question-view']: isEditID !== mcq._id })}
                        onInput={(e) => { handleEditQuestion(e) }}
                    ></div>
                </div>
                <div className='options-container'>
                    <ul style={{ padding: '0px 10px 0px 20px', margin: '5px 0px', listStyleType: 'decimal', fontSize: '22px', fontWeight: '550', fontFamily: 'supreme' }} >

                        {editOptions.map((option, index) => {
                            return (
                                <li key={index} className='option-container fade'>
                                    <div
                                        ref={(el) => { optionsRef.current[index] = el }}
                                        contenteditable={isEditID === mcq._id ? "true" : "false"}
                                        className={cx({ ['option-edit']: isEditID === mcq._id, ['option-view']: isEditID !== mcq._id })}
                                        onInput={(e) => { handleEditOption(e, index) }}
                                    >
                                    </div>
                                    <CSSTransition
                                        in={isEditID === mcq._id}
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
                            className={cx({ ['answer-edit']: isEditID === mcq._id, ['answer-view']: isEditID !== mcq._id })}
                            contenteditable={isEditID === mcq._id ? "true" : "false"}
                            onInput={(e) => {
                                setEditAnswer(e.target.textContent)
                                answerRef.current.classList.remove('invalid')
                            }}
                        ></div>
                    </div>
                    <div>
                        {isEditID === mcq._id ?
                            <div className='mcq-buttons'>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90px', height: '10px' }}>
                                    <button className='mcq-button' onClick={() => {
                                        questionRef.current.textContent = mcq.question

                                        setEditOptions(mcq.options)

                                        handleCancel(mcq._id)
                                    }}>cancel</button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '170px', height: '10px' }}>
                                    <button className='mcq-button' onClick={handleAddOption}>add option</button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '65px', height: '10px' }}>
                                    <button className='mcq-button' onClick={() => {
                                        if (editQuestion.length === 0) {
                                            questionRef.current.classList.add('invalid')
                                            return
                                        }

                                        let wrong = 0;
                                        editOptions.forEach((el, i) => {
                                            if (el.length === 0) {
                                                optionsRef.current[i].classList.add('invalid')
                                                wrong++;
                                            }

                                        })

                                        if (wrong > 0) {
                                            return
                                        }

                                        if (editAnswer.length === 0) {
                                            answerRef.current.classList.add('invalid')
                                            return
                                        }

                                        for (var i = 1; i <= editOptions.length; i++) {
                                            if (i == editAnswer) {
                                                handleSave(mcq._id, editQuestion, editOptions, editAnswer)
                                                return
                                            }
                                        }

                                        // if(!editAnswer.lenght)
                                        // console.log({
                                        //     editQuestion,
                                        //     editOptions,
                                        //     editAnswer
                                        // })
                                        answerRef.current.classList.add('invalid')
                                    }
                                    }
                                    >save</button>
                                </div>
                            </div> :
                            chooseAndAsk === true ?
                                <div className='mcq-buttons'>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90px', height: '10px' }}>
                                        <button className='mcq-button' onClick={() => { handleChooseAndAsk(editQuestion, editOptions, editAnswer) }}>choose</button>
                                    </div>
                                </div>
                                :
                                <div className='mcq-buttons'>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90px', height: '10px' }}>
                                        <button className='mcq-button' onClick={() => { handleClickEdit(mcq._id); }}>edit</button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px', height: '10px' }}>
                                        <button className='mcq-button' onClick={() => { handleClickDelete(mcq._id) }}>delete</button>
                                    </div>
                                </div>

                        }
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default MCQEdit
