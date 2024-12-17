import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StateProvider from './StateProvider.jsx'
import reducer,{ initialState } from './reducer.js'

createRoot(document.getElementById('root')).render(
  <StateProvider reducer={reducer} initialState={initialState}>
    <App />
  </StateProvider>,
)
