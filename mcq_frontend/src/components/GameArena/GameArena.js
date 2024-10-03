import React, { useContext, useEffect, useReducer, useState, useRef } from 'react'
import './GameArena.css'
import AppContext from '../../store/app-context'
import RequestNotification from '../RequestNotification/RequestNotification'
import { useNavigate, useParams } from 'react-router-dom'
import Countdown from '../Countdown/Countdown'
import { GAME_STATE, GAME_STATE_ACTION } from '../../constants'
import ASK from '../ASK/ASK'
import ANSWER from '../ANSWER/ANSWER'
import GameArenaHeader from '../GameArenaHeader/GameArenaHeader'
import MCQAsk from '../MCQAsk/MCQAsk'
import Score from '../Score/Score'
import Screen from '../Screen/Screen'
import Result from '../Result/Result'




const gameStateReducer = (state, action) => {
    switch (action.type) {
        case GAME_STATE_ACTION.SET_GAME_STATE: {
            const newState = action.payload.game
            return newState
        }

        case GAME_STATE_ACTION.SET_PLAYER2: {
            const newState = { ...state }
            newState.player2 = action.payload.player2
            return newState
        }

        case GAME_STATE_ACTION.SET_INITIALIZING: {
            const newState = { ...state }
            newState.state = action.payload.state
            newState.timer = action.payload.timer
            return newState
        }

        case GAME_STATE_ACTION.SET_ASK: {
            const newState = { ...state }
            newState.state = action.payload.state
            newState.timer = action.payload.timer
            newState.currentTurn = action.payload.currentTurn
            return newState
        }

        case GAME_STATE_ACTION.SET_ANSWER: {
            const newState = { ...state }
            newState.state = action.payload.state
            newState.timer = action.payload.timer
            newState.currentTurn = action.payload.currentTurn
            return newState
        }

        case GAME_STATE_ACTION.SET_SCORE: {
            const newState = { ...state }
            newState.player1Score = action.payload.player1Score
            newState.player2Score = action.payload.player2Score
            return newState
        }

        case GAME_STATE_ACTION.GAME_OVER: {
            const newState = { ...state }
            newState.state = action.payload.state
            return newState
        }

        default:
            return state
    }
}

const initialGameState = {

}


const GameArena = () => {
    const [oppName, setOppName] = useState(null)
    const [pendingRequests, setPendingRequests] = useState([])
    const [runState, setRunState] = useState(true)
    const { pusher, userInfo, login, pusherState } = useContext(AppContext)
    const [gameState, dispatchGameAction] = useReducer(gameStateReducer, initialGameState)
    const [MCQ, setMCQ] = useState()
    const [askQuestion, setAskQuestion] = useState("")
    const [askOptions, setAskOptions] = useState(["", "", ""])
    const [askAnswer, setAskAnswer] = useState(0)
    const [answer, setAnswer] = useState(0);
    const [win, setWin] = useState()
    const [chooseAndAsk, setChooseAndAsk] = useState(false)

    const questionRef = useRef(null)
    const optionsRef = useRef([])
    const answerRef = useRef(null)


    const { id: game_id } = useParams()
    const Navigate = useNavigate()

    useEffect(() => {

        try {

            if (!login) {
                Navigate('/')
            }


            const getGame = async () => {

                try {
                    const res = await fetch(`/games/${game_id}`, {
                        method: "GET",
                        headers: {
                            'Content-type': 'application/json'
                        }
                    })

                    if (!res.ok) {
                        throw new Error("error in fetching game")
                    }

                    const game = await res.json()

                    dispatchGameAction({
                        type: GAME_STATE_ACTION.SET_GAME_STATE,
                        payload: {
                            game
                        }
                    })



                }
                catch (e) {
                    console.log(e)
                }
            }

            getGame()

            if (pusher) {


                pusher.user.bind('join-req', (reqInfo) => {
                    const newReq = {
                        id: pendingRequests.length,
                        fromUserId: reqInfo.fromUser,
                        fromUserGameName: reqInfo.userGameName,
                        game: reqInfo.name,
                        game_id: reqInfo.gameId
                    }
                    setPendingRequests((state) => [...state, newReq])
                })

            }

            return () => {
                if (pusher) {
                    pusher.user.unbind()
                }
            }

        }
        catch (e) {
            console.log(e)
        }

    }, [pusher])

    useEffect(() => {
        try {
            if (gameState) {
                if (pusher) {
                    pusher.user.bind('player2', (info) => {
                        if (game_id === info.game_id) {
                            setOppName(info.player2Name)
                            dispatchGameAction({
                                type: GAME_STATE_ACTION.SET_PLAYER2,
                                payload: {
                                    player2: info.player2
                                }
                            })
                        }

                    })

                    const gameChannel = pusher.subscribe(`presence-${game_id}`)

                    gameChannel.bind('init-count', (data) => {
                        const { timer, state } = data

                        dispatchGameAction({
                            type: GAME_STATE_ACTION.SET_INITIALIZING,
                            payload: {
                                timer,
                                state
                            }
                        })

                    })

                    gameChannel.bind('ask', (data) => {
                        const { timer, state, currentTurn } = data

                        dispatchGameAction({
                            type: GAME_STATE_ACTION.SET_ASK,
                            payload: {
                                timer,
                                state,
                                currentTurn
                            }
                        })
                    })

                    gameChannel.bind('answer', (data) => {
                        const { timer, state, currentTurn, mcq } = data

                        dispatchGameAction({
                            type: GAME_STATE_ACTION.SET_ANSWER,
                            payload: {
                                timer,
                                state,
                                currentTurn,
                            }
                        })

                        setMCQ(mcq)
                    })


                    gameChannel.bind('update-score', (data) => {
                        const { player1Score, player2Score } = data

                        dispatchGameAction({
                            type: GAME_STATE_ACTION.SET_SCORE,
                            payload: {
                                player1Score,
                                player2Score
                            }
                        })
                    })

                    gameChannel.bind('result', (data) => {
                        const { winner } = data

                        setWin(winner)

                        dispatchGameAction({
                            type: GAME_STATE_ACTION.GAME_OVER,
                            payload: {
                                state: GAME_STATE.OVER
                            }
                        })
                    })


                }
            }
        }
        catch (e) {
            console.log(e)
        }


    }, [gameState, pusher])

    useEffect(() => {

        if (gameState && gameState.state === GAME_STATE.NOT_INITIALIZED && userInfo._id === gameState.player2) {

            const initialize = async () => {
                try {
                    const res = await fetch(`/gamearena/startgame/${game_id}`, {
                        method: "POST",
                        headers: {
                            'Content-type': 'application/json'
                        }
                    })

                    if (!res.ok) {
                        throw new Error("could not initialize")
                    }


                    const result = await res.json()

                    if (gameState.player1 === userInfo._id) {
                        setOppName(result.player2)
                    }
                    else {
                        setOppName(result.player1)
                    }
                }
                catch (e) {
                    console.log(e);
                }

            }

            initialize()

        }

    }, [gameState])

    // useEffect(() => {
    //     if (pusherState == 'connected') {
    //         if (runState == false) {
    //             //send resume
    //         }
    //     }
    //     if (pusherState == 'unavailable') {

    //     }
    // }, [pusherState])


    const handleRequestAccept = async (value) => {
        try {
            const res = await fetch(`/games/join-req-res/${value.game_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    response: "ACCEPTED",
                    toUser: value.fromUserId
                })
            })

            if (!res.ok) {
                throw new Error(
                    "Could not accept request"
                )
            }

            setPendingRequests([])
        }
        catch (e) {
            console.log(e)
        }

    }

    const handleRequestDecline = async (value) => {
        try {
            const res = await fetch(`/games/join-req-res/${value.game_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    response: "DECLINED",
                    toUser: value.fromUserId
                })
            })

            if (!res.ok) {
                throw new Error(
                    "Could not send response"
                )
            }

            let tempRequests = [...pendingRequests]
            tempRequests = tempRequests.filter((tempRequest) => (
                tempRequest.id !== value.id
            ))

            setPendingRequests(tempRequests)

        }
        catch (e) {
            console.log(e)
        }
    }

    const handleAsk = async (question, options, answer) => {
        const mcq = {
            question,
            options,
            answer,
        }

        try {

            console.log("/////////////////////////////////////////////////////////////////////////////")
            const res = await fetch(`/gamearena/ask/${game_id}/${userInfo._id}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(mcq)
            })

            if (!res.ok) {
                throw new Error("Response not okay")
            }

            setAskQuestion("");
            setAskOptions(["", "", ""])
            setAskAnswer(0)

        }
        catch (e) {
            console.log(e)
        }



    }
    const handleSaveandAsk = async (question, options, answer) => {
        const mcq = {
            question,
            options,
            answer,
        }

        try {


            const res = await fetch(`/gamearena/save&ask/${game_id}/${userInfo._id}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(mcq)
            })

            if (!res.ok) {
                throw new Error("Response not okay")
            }

            setAskQuestion("");
            setAskOptions(["", "", ""])
            setAskAnswer(0)

        }
        catch (e) {
            console.log(e)
        }
    }

    const handleAnswer = async (mcq_id, answer) => {
        try {
            const res = await fetch(`/gamearena/answer/${game_id}/${userInfo._id}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    mcq_id,
                    answer
                })
            })

            if (!res.ok) {
                throw new Error("response not okay")
            }

        }
        catch (e) {
            console.log(e);
        }

    }

    const handleAskQuestion = (question) => {
        setAskQuestion(question);
        questionRef.current.classList.remove('invalid')
    }

    const handleAskOptions = (options, i) => {
        setAskOptions(options);
        optionsRef.current[i]?.classList.remove('invalid')
    }

    const handleAskAnswer = (answer) => {
        setAskAnswer(answer);
        answerRef.current.classList.remove('invalid')
    }

    const handleChangeAnswer = (answer) => {
        setAnswer(answer)
    }


    return (
        <div className='gamearena-container'>
            <GameArenaHeader yourName={userInfo.gameName} gameName={gameState ? gameState.name : "loading.."} opponentName={oppName ? oppName : "Loading.."} timer={gameState ? gameState.timer : "0"}></GameArenaHeader>

            <div className='main-arena-container'>
                <Score
                    score={userInfo._id === gameState.player1 ? gameState.player1Score : gameState.player2Score}
                    player={1}
                ></Score>
                <Screen>
                    {gameState && gameState.state === GAME_STATE.ASK &&
                        <ASK
                            chooseAndAsk={chooseAndAsk}
                            currentTurn={gameState.currentTurn}
                            handleAskQuestion={handleAskQuestion}
                            handleAskOptions={handleAskOptions}
                            handleAskAnswer={handleAskAnswer}
                            askQuestion={askQuestion}
                            askOptions={askOptions}
                            askAnswer={askAnswer}
                            questionRef={questionRef}
                            optionsRef={optionsRef}
                            answerRef={answerRef}
                            handleAsk={handleAsk}
                        ></ASK>
                    }
                    {gameState && gameState.state === GAME_STATE.ANSWER &&
                        <ANSWER
                            mcq={MCQ}
                            currentTurn={gameState.currentTurn}
                            answer={answer}
                            handleChangeAnswer={handleChangeAnswer}
                        ></ANSWER>
                    }
                    {gameState && gameState.state === GAME_STATE.NOT_INITIALIZED &&
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                            <p style={{ display: 'flex', justifyContent: 'center', padding: '120px 0px', fontFamily: 'supreme', width: '510px', textAlign: 'center', fontSize: '30px', color: 'rgba(200,200,200)' }}>
                                Waiting for other player to join...
                            </p>
                        </div>
                    }

                    {gameState && gameState.state === GAME_STATE.OVER &&
                        <Result win={win}></Result>
                    }

                </Screen>
                <Score
                    score={userInfo._id !== gameState.player1 ? gameState.player1Score : gameState.player2Score}
                    player={2}
                ></Score>

            </div>
            {
                gameState && gameState.state === GAME_STATE.ASK && gameState.currentTurn === userInfo._id &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '1430px', height: '50px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: `${chooseAndAsk ? "200px" : "300px"}`, height: '10px', transition: 'width 0.05s ease' }}>
                        < button className='arena-button' onClick={() => {
                            if (chooseAndAsk) {
                                setChooseAndAsk(false)
                                return
                            }
                            setChooseAndAsk(true)
                        }}>{chooseAndAsk ? "Cancel" : "choose and ask"}</button>
                    </div>

                    {chooseAndAsk === false && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90px', height: '10px', marginLeft: '0px' }}>
                        <button className='arena-button' onClick={() => {
                            if (askQuestion.length === 0) {
                                questionRef.current.classList.add('invalid')
                                return
                            }

                            let wrong = 0;
                            askOptions.forEach((el, i) => {
                                if (el.length === 0) {
                                    optionsRef.current[i].classList.add('invalid')
                                    wrong++;
                                }

                            })

                            if (wrong > 0) {
                                return
                            }

                            if (askAnswer.length === 0) {
                                answerRef.current.classList.add('invalid')
                                return
                            }

                            for (var i = 1; i <= askOptions.length; i++) {
                                if (i == askAnswer) {
                                    handleAsk(askQuestion, askOptions, askAnswer)
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
                        }>ask</button>
                    </div>}
                    {chooseAndAsk === false && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '270px', height: '10px' }}>
                        < button className='arena-button' onClick={() => {
                            if (askQuestion.length === 0) {
                                questionRef.current.classList.add('invalid')
                                return
                            }

                            let wrong = 0;
                            askOptions.forEach((el, i) => {
                                if (el.length === 0) {
                                    optionsRef.current[i].classList.add('invalid')
                                    wrong++;
                                }

                            })

                            if (wrong > 0) {
                                return
                            }

                            if (askAnswer.length === 0) {
                                answerRef.current.classList.add('invalid')
                                return
                            }

                            for (var i = 1; i <= askOptions.length; i++) {
                                if (i == askAnswer) {
                                    handleSaveandAsk(askQuestion, askOptions, askAnswer)
                                    return
                                }
                            }

                        }}>save and ask</button>
                    </div>}
                </div >
            }

            {gameState && gameState.state === GAME_STATE.ANSWER && gameState.currentTurn === userInfo._id &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '1430px', height: '50px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90px', height: '10px', marginLeft: '10px' }}>
                        <button className='arena-button' onClick={() => handleAnswer(MCQ._id, answer + 1)}>answer</button>
                    </div>
                </div >
            }

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '1430px', height: '50px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '270px', height: '10px', marginLeft: '150px' }}>
                    <button className='arena-button-leave' style={{ backgroundColor: 'transparent', border: '0px', }}>my mcq</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '270px', height: '10px', marginRight: '150px' }}>
                    < button className='arena-button-leave' style={{ backgroundColor: 'transparent', border: '0px', }}>
                        <i class="fa fa-sign-out" aria-hidden="true" style={{ fontSize: '40px', marginRight: '8px' }}></i>
                        Exit</button>
                </div>
            </div >

            {gameState && gameState.state === GAME_STATE.INITIALIZING && <Countdown count={gameState.timer}></Countdown>}

            {pendingRequests.length > 0 &&
                pendingRequests.map((request) => (
                    <RequestNotification
                        value={request}
                        handleRequestAccept={handleRequestAccept}
                        handleRequestDecline={handleRequestDecline}
                    />
                ))
            }
        </div>
    )
}

export default GameArena