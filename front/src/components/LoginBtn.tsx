import React from 'react'
import { useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { DPButton } from '../common/types'
import { mainActions } from '../redux/mainSlice'

const LoginBtn = ({className}: DPButton) => {
	const dispatch = useDispatch()

	const handleClick = (e) => {
		dispatch(mainActions.setField({loginFormVisibility: true}))
	}

	return (
		<Button onClick={handleClick} className={className}>
			Log in
		</Button>
	)
}

const Button = styled.button(() => [
	tw`w-full text-[0.6rem] py-1 text-pink-600 border-[1px] rounded-sm border-pink-400`,
])

export default styled(LoginBtn)``;