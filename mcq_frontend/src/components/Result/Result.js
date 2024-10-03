import React, { useContext } from 'react'
import AppContext from '../../store/app-context'

const Result = ({ win }) => {
    const { userInfo } = useContext(AppContext)
    if (win.length > 1) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <p style={{ display: 'flex', justifyContent: 'center', padding: '120px 0px', fontFamily: 'supreme', width: '510px', textAlign: 'center', fontSize: '30px', color: 'rgba(200,200,200)' }}>
                    The match tied...
                </p>
            </div>
        )
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <p style={{ display: 'flex', justifyContent: 'center', padding: '120px 0px', fontFamily: 'supreme', width: '510px', textAlign: 'center', fontSize: '30px', color: 'rgba(200,200,200)' }}>
                {win.includes(userInfo._id) ? "Congratulations you won the game" : "oops you lost the game, keep trying"}
            </p>
        </div>
    )
}

export default Result