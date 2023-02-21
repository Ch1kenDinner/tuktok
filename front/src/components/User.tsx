import React from 'react'
import styled, { css } from 'styled-components'
import { CiLogin, CiLogout } from "react-icons/ci";
import tw from 'twin.macro'
import { DP } from '../common/types'
import { useDispatch } from 'react-redux'
import { mainActions } from '../redux/mainSlice'


const User = ({className}: DP) => {

	const profile = localStorage.getItem("profile") && JSON.parse(localStorage.getItem("profile") ?? '')
	const dispatch = useDispatch()

	const handleLoginClick = () => {
		dispatch(mainActions.setField({field: 'loginFormVisibility', value: true}))
	}

	const handleLogout = () => {
		localStorage.clear()
		window.location.reload()
	}

	return (
    <Wrapper className={className}>
      {profile ? (
        <>
          {profile.user.icon && <Image src={profile.user.icon} />}
          <p>{profile.user.email}</p>
          <LogoutButton onClick={handleLogout}>
            <CiLogout />
          </LogoutButton>
        </>
      ) : (
        <LoginButton onClick={handleLoginClick}>
          <p>Log In</p>
          <CiLogin />
        </LoginButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div(() => [
  tw`flex items-center text-pink-600 h-1/2`,
  css`
    font-size: 0.5em;

    svg {
      margin-bottom: -0.05rem;
    }
  `,
]);

const LoginButton = styled.button(() => [
	tw`flex items-center space-x-1 border-[1px] border-pink-400 rounded-3xl`,
	css`
		padding: 0.2em 0.8em;
	`
])

const LogoutButton = styled.button(() => [
	tw`p-2 rounded-[50%]`
])

const Image = styled.img(() => [
	tw`rounded-[50%] aspect-square h-full mr-1`
])

export default styled(User)``;