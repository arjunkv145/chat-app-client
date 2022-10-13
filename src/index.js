import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { getJWT, UserProvider } from './UserContext';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.headers.common['Authorization'] = "Bearer " + getJWT();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);