import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useMemo } from "react"
import Modal from "../UI/Modal/Modal"
import './Games.css'
import AppContext from "../../store/app-context"

const Games = ({ showGames, handleShowGames }) => {
    const [Games, setGames] = useState([])
    const { pusher, userInfo } = useContext(AppContext)
    const [searchTerm, setSearchTerm] = useState("")
    const Navigate = useNavigate()


    useEffect(() => {
        let newGameChannel = null;

        if (pusher) {
            newGameChannel = pusher.subscribe('new-games')

            newGameChannel.bind('created', (game) => {
                setGames((state) => [...state, game])
            })


            pusher.user.bind('join-req-res', (data) => {
                if (data.response === "ACCEPTED") {
                    console.log(`requested accepted for ${data.name}`)
                    const gameChannel = pusher.subscribe(`presence-${data.game_id}`)

                    gameChannel.bind('pusher:subscription_succeeded', async () => {
                        Navigate(`/home/${data.game_id}`)
                    })
                }
                else if (data.response === "DECLINED") {
                    console.log(`requested declined for ${data.name}`)
                }

            })
        }

        return () => {
            if (newGameChannel) {
                newGameChannel.unbind_all()
                newGameChannel.unsubscribe()
            }
            if (pusher) {
                pusher.user.unbind()
            }
        }
    }, [pusher])

    useEffect(() => {
        const getGames = async () => {
            try {
                const res = await fetch('/games', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (!res.ok) {
                    throw new Error('Could not fetch Games frontend')
                }

                const newGames = await res.json()

                await newGames.forEach((game) => {
                    game.isDisabled = false;
                })

                setGames(newGames)
            }
            catch (e) {
                console.log(e)
            }
        }

        getGames()
    })

    const filterGames = useMemo(() => {
        if (!Games) return [];
        return Games
            .filter((game) =>
                game.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
    }, [searchTerm, Games])

    const handleJoinGame = async (game, e) => {
        e.preventDefault()
        const icon = e.currentTarget.querySelector('.icon')

        icon.classList.add('animate');

        setTimeout(() => {
            icon.classList.remove('animate')
        }, 500)

        const newGames = [...Games];
        newGames.forEach((gamee) => {
            if (gamee._id === game._id) {
                gamee.isDisabled = true;
            }
        })
        setGames(newGames)

        setTimeout(() => {
            const newGames = [...Games];
            newGames.forEach((gamee) => {
                if (gamee._id === game._id) {
                    gamee.isDisabled = false;
                }
            })
            setGames(newGames)
        }, 10000)


        const res = await fetch(`games/join-req/${game._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromUser: userInfo._id,
                gameName: userInfo.gameName
            })
        })
    }


    return (
        <Modal show={showGames} handleShow={handleShowGames} backGround='rgba(200,250,200,0.9)'>
            <div className="search-container">
                <form className="search-form">
                    <label className="search-label">SEARCH</label>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="game..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value) }}
                    ></input>
                </form>
            </div>
            <div className="games-container">
                {/* <div className="games-container-inside"> */}
                {filterGames.map((game, i) => {
                    if (game.player2 || game.player1 === userInfo._id) {
                        return
                    }

                    return (<div
                        className="games-button-container"
                        key={game._id}
                    >

                        <p className="games-button">{game.name}</p>
                        <button className="add-icon-container" onClick={(e) => { handleJoinGame(game, e) }} disabled={game.isDisabled}>
                            <i className="fa fa-plus icon" aria-hidden="true" disabled={game.isDisabled}></i>
                        </button>

                    </div>
                    )
                })}
                {/* </div> */}
            </div>
        </Modal>
    )
}

export default Games