import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    connectLogger,
    createCtx,
} from '@reatom/framework'
import {reatomContext} from '@reatom/npm-react'
import './index.css'
import reportWebVitals from './reportWebVitals'
import {MapPage} from "./pages/mapPage/MapPage"

const ctx = createCtx()
connectLogger(ctx)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
    <React.StrictMode>
        <reatomContext.Provider value={ctx}>
            <MapPage />
        </reatomContext.Provider>
    </React.StrictMode>
)

// to log performance: reportWebVitals(console.log)
reportWebVitals()
