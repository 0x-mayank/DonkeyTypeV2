import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Test from './pages/Test'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className='min-h-screen bg-[#f2f0e3] text-gray-800'>
      <Navbar/>
      <main className='max-w-9xl mx-auto px-4 py-8'>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/test" element={<ProtectedRoute> <Test /> </ProtectedRoute>} />
          <Route path='/leaderboard' element={<Leaderboard/>} />
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
