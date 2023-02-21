import React from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Index from './pages/Index'
import { useCustomSelector } from './redux'
import Login from './sections/Login'

const App = () => {

	const {loginFormVisibility} = useCustomSelector((state) => state.main)

	return (
    <>
		{loginFormVisibility && <Login />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default styled(App)``