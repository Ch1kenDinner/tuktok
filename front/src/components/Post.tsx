import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { api, apiRoutes, BASE_URL } from '../api'
import { DP } from '../common/types'
import { IPost } from '../sections/Posts'

interface PostProps extends DP {
	post: IPost
}

const Post = ({post, className}: PostProps) => {

	return (
    <Wrapper className={className}>
      <Title>{post.title}</Title>
      {post.createdBy.picture && <AuthorPicture><img src={post.createdBy.picture} alt={'user_picture'}></img></AuthorPicture>}
      <Topics>{post.topics.map((el) => <Topic>{el.title}</Topic>)}</Topics>
			<Video controls>
        <source src={BASE_URL + apiRoutes.getVideo(post.videoId)} type='video/mp4' />
      </Video>
      <AuthorEmail>{post.createdBy.email}</AuthorEmail>
    </Wrapper>
  );
}

const Wrapper = styled.div(() => [
	tw`flex flex-col w-[16rem]`,
	css`
		display: grid;
		gap: 0.4rem;
		grid-template: 
		'picture email'
		'picture title'
		'. topics'
		'. video'
		/ 1.5rem 1fr;

		${Title} {
			grid-area: title;
		}
		${Topics} {
			grid-area: topics;
		}
		${Video} {
			grid-area: video;
		}
		${AuthorPicture} {
			grid-area: picture;
			margin: auto 0;
			aspect-ratio: 1/1;
			border-radius: 50%;
			overflow: hidden;
			${tw`flex items-center h-auto w-full justify-center`}

			img {
				width: auto;
				object-fit: cover;
				height: 100%;
			}
		}
		${AuthorEmail} {
			grid-area: email;
		}
	`
])

const Title = styled.h3(() => [
	css`
		font-size: 0.45rem;
	`
])

const Topics = styled.div(() => [
	tw`flex space-x-0.5`,
	css`
		font-size: 0.3rem;
	`
])

const Topic = styled.div(() => [
	css`
	text-decoration: underline;
		&::before {
			content: '#'
		}
	`
])

const Video = styled.video(() => [
	tw`aspect-video w-full`
])

const AuthorPicture = styled.div(() => [
	tw``
])

const AuthorEmail = styled.div(() => [
	css`
		font-size: 0.5rem;
		font-weight: 600;
	`
])

export default styled(Post)``;