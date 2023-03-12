import dayjs from "dayjs";
import { useContext } from "react";
import { FaRegComment } from "react-icons/fa";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { PostContext } from ".";
import { apiRoutes, BASE_URL } from "../../api";
import styles from "../../common/styles";
import { DP } from "../../common/types";
import DeleteButton from "../../components/DeleteButton";
import { ProfileContext } from "../../context/profileContext";
import { useStateReducer } from "../../hooks/useStateReducer";
import { fetchDeletePost } from "./api";
import { IPost } from "./types";

interface Props extends DP {
  post: IPost;
}

const Content = (props: Props) => {
  const [state, setState] = useStateReducer({
    isLoading: false,
  });
  const { mainState, setMainState } = useContext(PostContext);
  const profile = useContext(ProfileContext);

  const handleDeletePost = () => {
    setState({ isLoading: true });
    fetchDeletePost(props.post._id).then(() => {
      setState({ isLoading: false });
      setMainState({ isDeleted: true });
    });
  };

	const handleOpenComments = () => {
		setMainState({isCommentsHidden: false})
	}

  return (
    <Wrapper className={props.className}>
      <Title>{props.post.title}</Title>
      {props.post.createdBy.picture && (
        <AuthorPicture>
          <img src={props.post.createdBy.picture} alt={"user_picture"}></img>
        </AuthorPicture>
      )}
      <Topics>
        {props.post.topics.map((el) => (
          <Topic>{el.title}</Topic>
        ))}
      </Topics>
      <Video controls>
        <source
          src={BASE_URL + apiRoutes.getVideo(props.post.videoId)}
          type="video/mp4"
        />
      </Video>
      <AuthorEmail>{props.post.createdBy.email}</AuthorEmail>
      <CreatedAt>
        Uploaded: {dayjs(props.post.createdAt).format("DD.MM.YYYY")}
      </CreatedAt>
      <ButtonsWrapper>
        {profile?.user?._id == props.post.createdBy._id && (
          <DeleteButton
            disabled={state.isLoading}
            onConfirm={handleDeletePost}
          />
        )}
        <CommentButton onClick={handleOpenComments}>
          <FaRegComment />
          <span>
            {mainState.comments.length == 0
              ? "Write first comment!"
              : mainState.comments.length}
          </span>
        </CommentButton>
      </ButtonsWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`flex flex-col w-[16rem]`,
  css`
    display: grid;
    gap: var(--gap);
    grid-template:
      "picture email email"
      "picture title title"
      ". topics cAt"
      ". video video"
      ". btnsWrapper btnsWrapper"
      / var(--user-picture-column-width) 1fr;

    @media (hover: hover) {
      ${CommentButton}, ${DeleteButton} {
        opacity: 0.3;
      }
      &:hover ${DeleteButton}, &:hover ${CommentButton} {
        opacity: 1;
      }
      ${CommentButton}:hover {
				${styles.ring}
			}
    }

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
    }
    ${AuthorEmail} {
      grid-area: email;
    }
    ${CreatedAt} {
      grid-area: cAt;
    }
    ${ButtonsWrapper} {
      grid-area: btnsWrapper;
    }
  `,
]);

const ButtonsWrapper = styled.div(() => [
  tw`flex items-center px-1 h-6 relative bottom-[var(--gap)] mb-[-var(--gap)]`,
	css`
    border-style: none solid solid solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    & > * {
      ${tw`text-[0.5rem] text-pink-400`}
    }
  `,
]);

const CommentButton = styled.button(() => [
  tw`flex px-1 h-3 space-x-0.5 ml-auto items-center `,
  css`
    & span {
      font-size: 0.4rem;
    }
  `,
]);

const Title = styled.h3(() => [
  css`
    font-size: 0.45rem;
  `,
]);

const Topics = styled.div(() => [
  tw`flex space-x-0.5`,
  css`
    font-size: 0.3rem;
  `,
]);

const Topic = styled.div(() => [
  css`
    text-decoration: underline;
    &::before {
      content: "#";
    }
  `,
]);

const Video = styled.video(() => [tw`w-full rounded-sm aspect-video`]);

const AuthorPicture = styled.div(() => [
  css`
    margin: auto 0;
    aspect-ratio: 1/1;
    border-radius: 50%;
    overflow: hidden;
    ${tw`flex items-center justify-center w-full h-auto`}

    img {
      width: auto;
      object-fit: cover;
      height: 100%;
    }
  `,
]);

const AuthorEmail = styled.div(() => [
  css`
    font-size: 0.5rem;
    font-weight: 600;
  `,
]);

const CreatedAt = styled.p(() => [tw`italic opacity-20 text-[0.35rem]`]);

export default styled(Content)``;
