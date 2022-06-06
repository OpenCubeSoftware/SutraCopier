import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './fonts/cwTeXQKaiZH-Medium.ttf'
import './fonts/Fondamento-Regular.ttf'
import {Provider} from "react-redux";
import store from './store/index.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}><App/></Provider>
  </React.StrictMode>
)
