import React from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import tw from 'twin.macro'
import routes from './common/routes'
import Index from './pages/Index'
import { useCustomSelector } from './redux'
import Login from './sections/Login'
import Navbar from './sections/Navbar'
import CreatePost from './pages/CreatePost'

const App = () => {

	const {loginFormVisibility} = useCustomSelector((state) => state.main)

	return (
    <Wrapper>
      {loginFormVisibility && <Login />}
      <Navbar />

      <Routes>
        <Route path={routes.index} element={<Index />} />
        <Route path={routes.createPost} element={<CreatePost />} />
      </Routes>
    </Wrapper>
  );
}

const Wrapper = styled.div(() => [
	tw`h-screen`
])

export default styled(App)``