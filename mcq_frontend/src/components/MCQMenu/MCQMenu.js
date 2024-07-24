import React, { useEffect, useState } from 'react'
import Modal from '../UI/Modal/Modal'
import './MCQMenu.css'
// import { type } from '@testing-library/user-event/dist/type'



const MCQView = ({ mcq, handleClickEdit, handleClickDelete }) => {
    return (
        <div className='mcq-container'>
            <div className='question-container'>
                <div style={{ display: 'inline' }}>Q. </div>
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

            <div className='mcq-view-buttons-container'>
                <div>
                    <div style={{ display: 'inline' }}>Answer.</div>
                    <div className='answer-view'>{mcq.answer}</div>
                </div>
                <div className='mcq-view-buttons'>
                    <button className='mcq-view-button' onClick={() => { handleClickEdit(mcq._id); }}>edit</button>
                    <button className='mcq-view-button' onClick={() => { handleClickDelete(mcq._id) }}>delete</button>
                </div>
            </div>
        </div>
    )
}

const MCQEdit = ({ mcq, handleCancel, handleSave }) => {
    const [editQuestion, setEditQuestion] = useState(mcq.question)
    const [editOptions, setEditOptions] = useState(mcq.options)
    const [editAnswer, setEditAnswer] = useState(mcq.answer)

    const handleEditOption = (e, index) => {
        const newOptions = [...editOptions]
        newOptions[index] = e.target.value
        setEditOptions(newOptions)
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
        <div className='mcq-container'>
            <div className='question-container'>
                <div style={{ display: 'inline' }}>Q. </div>
                <input
                    className='question-edit'
                    value={editQuestion}
                    onChange={(e) => { setEditQuestion(e.target.value) }}
                ></input>
            </div>
            <div className='options-container'>
                <ul style={{ padding: '0px 10px 0px 20px', margin: '5px 0px', listStyleType: 'decimal' }} >
                    {editOptions.map((option, index) => {
                        return (
                            <li key={index} className='option-container'>
                                <input
                                    className='option-edit'
                                    value={editOptions[index]}
                                    onChange={(e) => { handleEditOption(e, index) }}
                                ></input>
                                <button className='delete-option' onClick={() => { handleDeleteOption(index); }}>delete</button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className='mcq-edit-buttons-container'>
                <div>
                    <div style={{ display: 'inline' }}>Answer.</div>
                    <input
                        className='answer-edit'
                        value={editAnswer}
                        onChange={(e) => { setEditAnswer(e.target.value) }}
                    ></input>
                </div>
                <div className='mcq-edit-buttons'>
                    <button className='mcq-edit-button' onClick={() => { handleCancel(mcq._id) }}>cancel</button>
                    <button className='mcq-edit-button' onClick={handleAddOption}>add option</button>
                    <button className='mcq-edit-button' onClick={() => { handleSave(mcq._id, editQuestion, editOptions, editAnswer) }}>save</button>
                </div>
            </div>
        </div>
    )
}


const MCQType = ({ handleClickEdit, handleCancel, handleSave, handleClickDelete, isEditID, MCQs }) => {

    return (
        <div>
            {MCQs.length === 0 && <div>Zero MCQs</div>}
            {MCQs.length > 0 && MCQs.map((mcq) => {
                if (isEditID === mcq._id) {
                    return (
                        <MCQEdit key={mcq._id} mcq={mcq} handleCancel={handleCancel} handleSave={handleSave}></MCQEdit>
                    )
                }
                else {
                    return (
                        <MCQView key={mcq._id} mcq={mcq} handleClickEdit={handleClickEdit} handleClickDelete={handleClickDelete} ></MCQView>
                    )
                }
            })}
        </div>
    )
}
const MCQMenu = () => {

    const [isEditID, setisEditID] = useState()
    const [MCQs, setMCQs] = useState([])
    const [inputMCQ, setInputMCQ] = useState()
    const [isInputMCQ, setIsInputMCQ] = useState(false)

    const handleClickEdit = (id) => {
        setisEditID(id)
    }

    const handleCancel = (id) => {
        if (id === 1) {
            setIsInputMCQ(false)
            return
        }
        setisEditID(null)

    }

    const handleSave = async (id, question, options, answer) => {
        if (id === 1) {

            const newMCQ = {
                question,
                options,
                answer
            }
            const response = await fetch('http://localhost:5000/mcqs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjhiZjE4YmU3ZDFkODQwZGMxOTFlNTEiLCJpYXQiOjE3MjA0NjMwMTR9.A_9fME8_wF4xFIch83O4IQGh-aF4kYIsUmTp0odxq-I'
                },
                body: JSON.stringify(newMCQ)
            })

            if (!response.ok) {
                console.log('error')
                return
            }

            const result = await response.json()
            console.log(result)
            let newMCQs = [...MCQs]
            newMCQs = newMCQs.concat(result)
            console.log(newMCQs)
            setMCQs(newMCQs)
            setIsInputMCQ(false)
            return
        }
        const newMCQs = [...MCQs]
        const index = newMCQs.findIndex((MCQ) => MCQ._id === id)
        const newMCQ = {
            _id: id,
            question: question,
            options: options,
            answer: answer
        }
        newMCQs[index] = newMCQ
        setMCQs(newMCQs)
        setisEditID(null)
    }

    const handleClickDelete = (id) => {
        let newMCQs = [...MCQs]
        newMCQs = newMCQs.filter((newMCQ) => newMCQ._id !== id)
        const deleteMCQ = async () => {
            const url = `http://localhost:5000/mcqs/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjhiZjE4YmU3ZDFkODQwZGMxOTFlNTEiLCJpYXQiOjE3MjA5NDk2MjV9.N-HPYRti6r3ZNDPyAo-rRE6WGkILCgMK5zz-Sjo_3HM'
                }
            })
            console.log(response)
        }
        setMCQs(newMCQs)
        deleteMCQ()

    }


    useEffect(() => {
        console.log('useEffect at work !!!')
        async function fetchMCQ() {
            try {
                const response = await fetch('http://localhost:5000/mcqs', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjhiZjE4YmU3ZDFkODQwZGMxOTFlNTEiLCJpYXQiOjE3MjA0NjMwMTR9.A_9fME8_wF4xFIch83O4IQGh-aF4kYIsUmTp0odxq-I'
                    }
                })

                if (!response.ok) {
                    console.log('error')
                    return
                }

                const result = await response.json()
                console.log('setting from useEffect')
                setMCQs(result)
            }
            catch (e) {

            }
        }

        fetchMCQ()

    }, [])

    const onClickAddMCQ = () => {
        setIsInputMCQ(true)
        const tempMCQ = {
            _id: 1,
            question: String,
            options: ["", "", ""],
            answer: Number
        }
        setInputMCQ(tempMCQ)

    }


    return (
        <Modal>
            <div>
                <button onClick={onClickAddMCQ} >add mcq</button>
            </div>
            {isInputMCQ && <MCQEdit mcq={inputMCQ} handleCancel={handleCancel} handleSave={handleSave}></MCQEdit>}
            <MCQType
                handleClickEdit={handleClickEdit}
                handleCancel={handleCancel}
                handleSave={handleSave}
                handleClickDelete={handleClickDelete}
                onClickAddMCQ={onClickAddMCQ}
                isEditID={isEditID}
                MCQs={MCQs}
            ></MCQType>
        </Modal>
    )
}

export default MCQMenu