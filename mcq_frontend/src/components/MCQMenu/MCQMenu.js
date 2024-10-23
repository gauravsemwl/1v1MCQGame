import React, { useEffect, useState } from 'react'
import Modal from '../UI/Modal/Modal'
import './MCQMenu.css'
import MCQEdit from '../MCQEdit/MCQEdit'
import MCQView from '../MCQView/MCQView'
// import { type } from '@testing-library/user-event/dist/type'


const MCQType = ({ handleClickEdit, handleCancel, handleSave, handleClickDelete, isEditID, MCQs, chooseAndAsk, handleChooseAndAsk }) => {

    return (
        <div>
            {MCQs.length === 0 && <div className='mcq-container' style={{ display: 'flex', justifyContent: 'center', fontFamily: 'supreme' }}>Zero MCQs</div>}
            {MCQs.length > 0 && MCQs.map((mcq) => {
                return (
                    <MCQEdit key={mcq._id} mcq={mcq} handleClickEdit={handleClickEdit} handleClickDelete={handleClickDelete} handleCancel={handleCancel} handleSave={handleSave} isEditID={isEditID} chooseAndAsk={chooseAndAsk} handleChooseAndAsk={handleChooseAndAsk}></MCQEdit>
                )

            })}
        </div>
    )
}
const MCQMenu = ({ showMCQMenu, handleShowMCQMenu, chooseAndAsk, handleChooseAndAsk }) => {

    const [isEditID, setisEditID] = useState()
    const [MCQs, setMCQs] = useState([])
    const [inputMCQ, setInputMCQ] = useState({})
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

            console.log(newMCQ)
            const response = await fetch('/mcqs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMCQ)
            })

            if (!response.ok) {
                console.log(await response.json())
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

        console.log({
            question,
            options,
            answer
        })
        const response = await fetch(`/mcqs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                question,
                options,
                answer
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })


        if (!response.ok) {
            console.log(await response.json())
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
            const url = `/mcqs/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            console.log(response)
        }
        setMCQs(newMCQs)
        deleteMCQ()

    }


    useEffect(() => {
        setIsInputMCQ(false)
        async function fetchMCQ() {
            try {
                const response = await fetch('/mcqs', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (!response.ok) {
                    console.log('error')
                    return
                }

                const result = await response.json()
                setMCQs(result)
            }
            catch (e) {

            }
        }

        fetchMCQ()

    }, [showMCQMenu])

    const onClickAddMCQ = () => {
        setIsInputMCQ(true)
        const tempMCQ = {
            _id: 1,
            question: String,
            options: ["", "", ""],
            answer: Number
        }
        setInputMCQ(tempMCQ)
        setisEditID(1)

    }


    return (
        <Modal show={showMCQMenu} handleShow={handleShowMCQMenu} backGround='rgba(200,250,200,0.9)' >
            <div className='mcqs-container'>
                <div style={{
                    display: 'flex',
                    width: '500px',
                    height: '30px'
                }}>
                    <button onClick={onClickAddMCQ}
                        className='mcq-button'
                        style={{ borderRadius: '2px', height: '30px', backgroundColor: 'rgba(230,230,230,0.7)', color: 'rgba(300,0,50)' }}
                    >add mcq</button>
                </div>
                {isEditID === 1 && isInputMCQ && <MCQEdit mcq={inputMCQ} handleClickEdit={handleClickEdit} handleClickDelete={handleClickDelete} handleCancel={handleCancel} handleSave={handleSave} isEditID={isEditID}></MCQEdit>}
                <MCQType
                    handleClickEdit={handleClickEdit}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    handleClickDelete={handleClickDelete}
                    onClickAddMCQ={onClickAddMCQ}
                    isEditID={isEditID}
                    MCQs={MCQs}
                    chooseAndAsk={chooseAndAsk}
                ></MCQType>
            </div>
        </Modal>
    )
}

export default MCQMenu