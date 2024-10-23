import React, { useEffect, useState } from 'react'
import AppContext from './app-context'
import Pusher from 'pusher-js'
import { useNavigate } from 'react-router-dom'

const AppContextProvider = ({ children }) => {

    const [pusher, setPusher] = useState()
    const [login, setLogin] = useState(localStorage.getItem('userInfo') ? true : false)
    const [pusherState, setPusherState] = useState(null)
    const [userInfo, setUserInfo] = useState(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null)

    // const Navigate = useNavigate()


    // useEffect(() => {
    //     const loginUser = async () => {
    //         const res = await fetch('/users/auth-check', {
    //             method: "GET",
    //             headers: {
    //                 'Content-type': 'application/json'
    //             }
    //         })

    //         if (!res.ok) {
    //             if (localStorage.getItem('userInfo')) {
    //                 localStorage.removeItem('userInfo');
    //             }
    //             if (setLogin) {
    //                 setLogin(false)
    //             }
    //             return
    //         }

    //         var result = await res.json();
    //         result = JSON.stringify(result);
    //         console.log(result)
    //         localStorage.setItem('userInfo', result)
    //         setLogin(true)
    //     }

    //     loginUser()


    // }, [])

    useEffect(() => {
        let pusherInstance = null;

        if (login) {
            try {
                Pusher.logToConsole = true
                console.log(userInfo)
                const temp = userInfo
                console.log(temp);
                pusherInstance = new Pusher("825dedeb6f3b856eef05", {
                    forceTLS: true,
                    app_id: "1843782",
                    secret: "796426aeb51f0bd0da49",
                    cluster: "ap2",
                    userAuthentication: {
                        params: {
                            _id: temp._id,
                            gameName: temp.gameName
                        }
                    },
                    channelAuthorization: {
                        params: {
                            _id: temp._id
                        }
                    }
                })

                if (!pusherInstance) {
                    throw new Error({ message: 'coud not create pusher Instance' })
                }

                pusherInstance.signin()

                pusherInstance.connection.bind('state_change', (states) => {
                    setPusherState(states.current)
                })

                setPusher(pusherInstance)


            }
            catch (e) {
                console.log(e)
            }
        }
        return () => {
            if (pusherInstance) {
                pusherInstance.disconnect()
            }
        }
    }, [login])



    const handleLogin = (info) => {
        const newInfo = JSON.parse(info)
        localStorage.setItem('userInfo', info)
        setUserInfo(newInfo);
        setLogin(true)
    }

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        setLogin(false)
        setPusher(null)
    }

    const initialContext = {
        pusher: pusher,
        pusherState: pusherState,
        login: login,
        userInfo: userInfo,
        handleLogin: handleLogin,
        logout: logout
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <AppContext.Provider value={initialContext}>
            {children}
        </AppContext.Provider>
    )

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

export default AppContextProvider  