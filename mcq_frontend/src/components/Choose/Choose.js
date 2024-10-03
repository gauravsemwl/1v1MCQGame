
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import MCQEdit from '../MCQEdit/MCQEdit'

const Choose = ({ handleChooseAndAsk }) => {
    const [MCQs, setMCQs] = useState([])
    useEffect(() => {
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

    }, [])

    return (
        <div>
            {MCQs.length === 0 && <div className='mcq-container' style={{ display: 'flex', justifyContent: 'center', fontFamily: 'supreme' }}>Zero MCQs</div>}
            {MCQs.length > 0 && MCQs.map((mcq) => {
                return (
                    <MCQEdit key={mcq._id} mcq={mcq} chooseAndAsk={true} handleChooseAndAsk={handleChooseAndAsk}></MCQEdit>
                )

            })}
        </div>
    )
}

export default Choose