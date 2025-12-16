import React, { useState, useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Test from './pages/Test'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  if (isMobile) {
    return (
      <div className='min-h-screen bg-[#f2f0e3] flex flex-col justify-center items-center p-6 text-center'>
        <h1 className='font-instrument text-2xl md:text-3xl text-gray-800 mb-4'>
          <span className='text-[#f76f53] italic'>donkeyType</span> is only available on desktop
        </h1>
      </div>
    );
  }

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