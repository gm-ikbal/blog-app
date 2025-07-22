import React from 'react'
import { Routes, Route, BrowserRouter, Router } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Project'
import Signup from './pages/Signup'
import Signin from './pages/Signin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Home/>}></Route>
        <Route path="/about" element={<About/>}></Route>
          <Route path="/projects" element={<Projects/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/signin" element={<Signin/>}></Route>
        </Routes>
      </BrowserRouter>

  )
}
