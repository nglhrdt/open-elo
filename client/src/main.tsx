import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/app'
import './index.css'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
