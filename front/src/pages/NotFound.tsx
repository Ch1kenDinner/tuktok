import React from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

type Props = {}

const NotFound = (props: Props) => {
	return (
		<Wrapper></Wrapper>
	)
}

const Wrapper = styled.div(() => [
	tw`flex items-center justify-center w-full h-screen bg-black`,
	css`
		&:after {
			content: '404';
			display: block;
			font-size: 5rem;
			${tw`text-pink-600`}
		}
	`
])

export default NotFound