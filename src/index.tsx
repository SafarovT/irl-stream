import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {MapPage} from "./pages/mapPage/MapPage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <MapPage />
  </React.StrictMode>
)

// to log performance: reportWebVitals(console.log)
reportWebVitals()
