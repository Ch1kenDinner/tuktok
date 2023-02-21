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


const Index = () => {

	return (
    <Wrapper>
      <Navbar />
			<Content>
				<Info />
			</Content>
    </Wrapper>
  );
}

const Wrapper = styled.div(() => [
	tw``,
])

const Content = styled.div(() => [
	tw`flex`,
	css`
		${Info} {
			max-width: 30%;
		}
	`
])

export default styled(Index)``