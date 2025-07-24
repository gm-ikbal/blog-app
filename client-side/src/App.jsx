import './App.css'; // Make sure this is imported
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Project';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Header from './component/Header';
import FooterCom from './component/FooterCom';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './component/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </main>

        <FooterCom />
      </div>
    </BrowserRouter>
  );
}
