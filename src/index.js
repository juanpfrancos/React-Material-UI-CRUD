import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.js'
import CssBaseline from '@material-ui/core/CssBaseline';
ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <App />
    </React.StrictMode>,
    document.getElementById("app"),
);
