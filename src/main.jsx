import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Crud from './Crud.jsx'
// import App from './App.jsx'
// import Create from './components/create'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App/> */}
    <Crud/>
  </StrictMode>,
)
