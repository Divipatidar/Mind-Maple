import './App.css';
import Home from './Frontend/Pages/homePage/Home.js';
import Login from './Frontend/Pages/LoginPage/Login.js';
import  {PrivateRoute}  from './Frontend/Componenets/router/routter.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import  {PrivateRouteAnalysis}  from './Frontend/Componenets/router/analysisrouter.js';
import Analylis from './Frontend/Pages/analylis/Analylis.js';
import Error from './Frontend/Pages/error/Error.js';
import Messagee from './Frontend/Pages/message/Messagee.js';
import { useContext, useEffect } from 'react';
import LoginContext from './Frontend/context/context.js';
import axios from 'axios';


function App() {
  const { login } = useContext(LoginContext);
  
  useEffect(() => {
    async function isUser() {
      try {
        const user = await axios.get(
          "http://localhost:8000" + "/isUser",
          {
            withCredentials: true,
          }
        );
        if (user) {
          console.log("Yes");
          login();
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    isUser();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
      <Route
          path="/login"
          element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          }
        />
         <Route path="/" element={<Home />} />
         <Route path="/message" element={<Messagee/>} />
         
          <Route
          path="/analysis"
          element={
            <PrivateRouteAnalysis>
              <Analylis />
            </PrivateRouteAnalysis>
          }
        />
           
        <Route path="*" element={<Error />} />
      </Routes> 
    </BrowserRouter>
  );
}

export default App;




