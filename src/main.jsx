import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import { CandidatesProvider } from './context/CandidatesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CandidatesProvider>
        <App />
      </CandidatesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
