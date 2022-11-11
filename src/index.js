import userEvent from '@testing-library/user-event'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
const rootElement = ReactDOM.createRoot(document.getElementById('root'))


rootElement.render(
    <>
        <App/>
    </>
)