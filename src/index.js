import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import { AppContextProvider } from './utils/contexto';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App></App>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

