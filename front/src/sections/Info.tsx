import React from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import {HiHome} from 'react-icons/hi'
import LoginBtn from '../components/LoginBtn'
import { DP } from '../common/types'
import Topics from './Topics'

const Info = ({className}: DP) => {

	const profile = localStorage.getItem('profile')

	return (
    <Wrapper className={className}>
      <ForUBtn>
        <HiHome />
        <p>For You</p>
      </ForUBtn>
      {!profile && (
        <LoginWrapper>
          <LoginInfo>Log in to like and comment on videos</LoginInfo>
          <LoginBtn />
        </LoginWrapper>
      )}
      <Topics />
    </Wrapper>
  );
}

const Wrapper = styled.div(() => [
	css`
		--p-clr: rgba(0, 0, 0, 0.2);
		padding: 0.6rem var(--gap-x-global);

		& > * + * {
			border-top: var(--hr-border);
			padding-top: 0.3rem;
			margin-top: 0.6rem;
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

const LoginWrapper = styled.div(() => [
	css``
])

const ForUBtn = styled.button(() => [
	tw`flex items-center w-full space-x-1 text-pink-600`,
	css`
		font-size: 0.6rem;
	`
])

export default styled(Info)``;