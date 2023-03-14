import dayjs from "dayjs";
import { useContext } from "react";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { PostContext } from ".";
import { apiRoutes, BASE_URL } from "../../api";
import styles from "../../common/styles";
import { DP } from "../../common/types";
import DeleteButton from "../../components/DeleteButton";
import { ProfileContext } from "../../context/profileContext";
import { useStateReducer } from "../../hooks/useStateReducer";
import { fetchDeletePost, fetchLikePost } from "./api";

interface Props extends DP {}

const Content = (props: Props) => {
  const [state, setState] = useStateReducer({
    isLoading: false,
		fetchLikeLoading: false
  });
  const { mainState, setMainState } = useContext(PostContext);
  const profile = useContext(ProfileContext);

  const handleDeletePost = () => {
    setState({ isLoading: true });
    fetchDeletePost(mainState.post._id).then(() => {
      setState({ isLoading: false });
      setMainState({ isDeleted: true });
    });
  };

  const handleOpenComments = () => {
    setMainState({ isCommentsHidden: !mainState.isCommentsHidden });
  };

  const handleLikePost = () => {
    setState({ fetchLikeLoading: true });
    fetchLikePost(mainState.post._id)
      .then(({ status, data }) => {
        if (status == 200)
          setMainState({ post: { ...mainState.post, ...data } });
      })
      .finally(() => {
        setState({ fetchLikeLoading: false });
      });
  };

  return (
    <Wrapper className={props.className}>
      <Title>{mainState.post.title}</Title>
      {mainState.post.createdBy.picture && (
        <AuthorPicture>
          <img
            src={mainState.post.createdBy.picture}
            alt={"user_picture"}
          ></img>
        </AuthorPicture>
      )}
      <Topics>
        {mainState.post.topics.map((el) => (
          <Topic>{el.title}</Topic>
        ))}
      </Topics>
      <Video controls>
        <source
          src={BASE_URL + apiRoutes.getVideo(mainState.post.videoId)}
          type="video/mp4"
        />
      </Video>
      <Username>{mainState.post.createdBy.username}</Username>
      <CreatedAt>
        Uploaded: {dayjs(mainState.post.createdAt).format("DD.MM.YYYY")}
      </CreatedAt>
      <ButtonsWrapper>
        {profile?.user?._id == mainState.post.createdBy._id && (
          <DeleteButton
            disabled={state.isLoading}
            onConfirm={handleDeletePost}
          />
        )}
        <ActionButton disabled={state.fetchLikeLoading} onClick={handleLikePost}>
          {mainState.post.isLiked ? (
            <MdOutlineFavorite />
          ) : (
            <MdOutlineFavoriteBorder />
          )}
          <span>{mainState.post.likes}</span>
        </ActionButton>
        <ActionButton onClick={handleOpenComments}>
          <FaRegComment />
          <span>
            {mainState.comments.length == 0
              ? "Write first comment!"
              : mainState.comments.length}
          </span>
        </ActionButton>
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

    ${DeleteButton} {
      ${tw`mr-auto`}
    }

    @media (hover: hover) {
      ${ActionButton}, ${DeleteButton} {
        opacity: 0.3;
      }
      &:hover ${DeleteButton}, &:hover ${ActionButton} {
        opacity: 1;
      }
      ${ActionButton}:hover {
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
    ${Username} {
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
  tw`flex items-center gap-x-1 justify-end px-1 h-6 relative bottom-[var(--gap)] mb-[-var(--gap)]`,
  css`
    border-style: none solid solid solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    & > * {
      ${tw`text-[0.5rem] text-pink-400`}
    }
  `,
]);

const ActionButton = styled.button(() => [
  tw`flex px-1 h-3 space-x-0.5 items-center `,
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

const Username = styled.div(() => [
  css`
    font-size: 0.5rem;
    font-weight: 600;
  `,
]);

const CreatedAt = styled.p(() => [tw`italic opacity-20 text-[0.35rem]`]);

export default styled(Content)``;
