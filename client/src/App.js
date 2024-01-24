import React, { useEffect } from "react";
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Chat, Login, NotFound, Register } from './views/index';
import init from './init';
import { AuthProvider } from "./context/useAuth";


function App() {

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="container-fluid" id="main-container">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Chat />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
