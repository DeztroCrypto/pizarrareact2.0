import userEvent from '@testing-library/user-event'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import io from 'socket.io-client'
const rootElement = ReactDOM.createRoot(document.getElementById('root'))

const socket = io('http://localhost:3001')

rootElement.render(
    <>
        <App socket = {socket}/>
    </>
)