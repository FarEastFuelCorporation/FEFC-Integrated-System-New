// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Importing the global styles
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // This assumes there is a <div id="root"></div> in your public/index.html
);
