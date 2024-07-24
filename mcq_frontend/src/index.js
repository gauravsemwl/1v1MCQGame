import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Games from './components/Games/Games';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import MCQMenu from './components/MCQMenu/MCQMenu';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          {
            path: '/mcqmenu/',
            element: <MCQMenu />
          }
        ]
      },
      {
        path: '/login',
        element: <Signup />
      }
    ]
  },

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={route}></ RouterProvider>
);

