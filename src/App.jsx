import React from 'react'
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import MainComponent from "./pages/MainComponent";
import { GoogleOAuthProvider } from '@react-oauth/google';
import useAuth from "./middlewares/useAuth";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";

const App = () => {

  const isAuthenticated = useAuth();

  return (
    <GoogleOAuthProvider clientId="191570489931-j27lojkfomhcrh0bd8kov53irk2quc08.apps.googleusercontent.com">
      <div className="App">
        <Header />
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/signup" element={<Navigate to="/" />} />
              <Route path="/signin" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
            </>
          )}
          <Route path="/*" element={<MainComponent />} />
        </Routes>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  )
}

export default App