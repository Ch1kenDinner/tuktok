import { useEffect } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { api, apiRoutes } from '../api'
import { DP } from '../common/types'
import Post from '../components/Post'
import useCustomState from '../hooks/useCustomState'

export interface IPost {
	title: string,
	videoId: string,
	createdBy: {picture?: string, email: string},
	topics: {title: string, icon?: string}[]
}

interface IInitState {
	posts: IPost[],
	isLoading: boolean
}

const initState: IInitState = {
	posts: [],
	isLoading: false
}

const Posts = ({className}: DP) => {
	const state = useCustomState(initState)

	const fetchGetPosts = () => {
		state.isLoading = true
		api.get(apiRoutes.getPostsPreview).then(({data}) => {
			state.posts = data.videos
		}).finally(() => {state.isLoading = false})
	}

	useEffect(() => {
		fetchGetPosts()
	}, [])

	if (state.isLoading) return <>Loading...</>
	if (!state.posts || !state.posts.length) return <>Not found</>

	return (
		<Wrapper className={className}>
			{state.posts.map((el) => <Post post={el} />)}
		</Wrapper>
	)
}

const Wrapper = styled.div(() => [
	tw`flex flex-col items-center overflow-y-auto`,
	css`
		${Post}:first-child {
			margin-top: 0.5rem;
		}
		${Post}:last-child {
			margin-bottom: 0.5rem;
		}
		${Post} + ${Post} {
			border-top: var(--hr-border);
			margin-top: 1.5rem;
			padding-top: 1rem;
		}	
	`
])

export default styled(Posts)``;