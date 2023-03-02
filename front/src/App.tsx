import React from 'react'
import { Outlet, Route, Router, Routes } from 'react-router-dom'
import styled from 'styled-components'
import tw from 'twin.macro'
import routes from './common/routes'
import Index from './pages/Index'
import { useCustomSelector } from './redux'
import Login from './sections/Login'
import Navbar from './sections/Navbar'
import CreatePost from './pages/CreatePost'
import NotFound from './pages/NotFound'

const App = () => {

	const {loginFormVisibility} = useCustomSelector((state) => state.main)

	return (
    <Routes>
      <Route
        path="/"
        element={
          <Wrapper>
            {loginFormVisibility && <Login />}
            <Navbar />
            <Outlet />
          </Wrapper>
        }
      >
        <Route path={routes.index} element={<Index />} />
        <Route path={routes.createPost} element={<CreatePost />} />
      </Route>

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

const Wrapper = styled.div(() => [
	tw`h-screen`
])

export default styled(App)``