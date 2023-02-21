import React from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import {SiAirplayvideo} from 'react-icons/si'
import User from '../components/User'

const Navbar = () => {

	return (
		<Wrapper>
			<LogoButton>
				<SiAirplayvideo />
				<p className='text'>TukTok</p>
			</LogoButton>
			<User />
		</Wrapper>
	)
}

const Wrapper = styled.nav(() => [
	tw`flex items-center`,
	css`
		padding: 0 var(--gap-x-global);
		height: 2rem;
		border-bottom: var(--hr-border);

		${User} {
			margin-left: auto;
		}
	`
])

const LogoButton = styled.button(() => [
  tw`flex items-center space-x-1 text-pink-600`,
  css`
		font-size: 1em;
		
		.text {
			font-family: 'Phudu', cursive;
			font-weight: 500;
		}

		svg {
			font-size: 0.79em;
			margin-bottom: -3px;
		}
	`,
]);

export default styled(Navbar)``