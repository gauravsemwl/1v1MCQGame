import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppContextProvider from './store/AppContextProvider';
import StartGame from './components/StartGame/StartGame';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import MCQMenu from './components/MCQMenu/MCQMenu';
import GameArena from './components/GameArena/GameArena';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Signup />,
      },
      {
        path: '/home/',
        element: <Home />,
      },
      {
        path: '/home/:id/',
        element: <GameArena />
      }
    ]
  },

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppContextProvider>
    <RouterProvider router={route}></ RouterProvider>
  </AppContextProvider>
);

