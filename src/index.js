import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import ContextProvider from "./Frontend/context/contextProvider.js"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
        <App />
    </ContextProvider>
);


reportWebVitals();
