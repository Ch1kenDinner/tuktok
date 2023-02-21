import React from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import {HiHome} from 'react-icons/hi'
import LoginBtn from '../components/LoginBtn'
import { DP } from '../common/types'
import Topics from './Topics'

const Info = ({className}: DP) => {
	return (
		<Wrapper className={className}>
			<ForUBtn>
				<HiHome />
				<p>For You</p>
			</ForUBtn>
			<LoginInfo>Log in to like and comment on videos</LoginInfo>
			<LoginBtn />
			<Topics />
		</Wrapper>
	)
}

const Wrapper = styled.div(() => [
	tw`px-1`,
	css`
		--p-clr: rgba(0, 0, 0, 0.2);

		${Topics} {
			margin-top: 1rem;
		}
	`
])

const LoginInfo = styled.p(() => [
	tw`mt-2 mb-0.5`,
  css`
    color: var(--p-clr);
    font-size: 0.4rem;
  `,
]);

const ForUBtn = styled.button(() => [
	tw`flex items-center w-full space-x-1 text-pink-600`,
	css`
		font-size: 0.6rem;
		padding: 1em 0;

		border-bottom: var(--hr-border);
	`
])

export default styled(Info)``;