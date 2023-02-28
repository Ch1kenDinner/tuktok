import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import Navbar from '../sections/Navbar'
import {useEffect} from 'react'
import axios from 'axios'
import { api, apiRoutes } from '../api'
import JSZip from 'jszip'
import useCustomState from '../hooks/useCustomState'
import CreatePostForm from '../sections/CreatePostForm'
import Info from '../sections/Info'
import Posts from '../sections/Posts'


const Index = () => {

	return (
		<Wrapper>
			<Info />
			<Posts />
		</Wrapper>
  );
}

const Wrapper = styled.div(() => [
	css`
		height: calc(100vh - var(--nav-h));
		display: grid;
		grid-template-columns: 1fr 3fr;
	`
])

export default styled(Index)``