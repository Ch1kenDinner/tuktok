import dayjs from "dayjs";
import { useContext } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { PostContext } from ".";
import { apiRoutes, BASE_URL } from "../../api";
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
	const {mainState, setMainState} = useContext(PostContext)
  const profile = useContext(ProfileContext);

  const handleDeletePost = () => {
    setState({ isLoading: true });
    fetchDeletePost(props.post._id).then(() => {
      setState({ isLoading: false });
			setMainState({isDeleted: true})
    });
  };

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
      {profile?.user?._id == props.post.createdBy._id && (
        <DeleteButton disabled={state.isLoading} onConfirm={handleDeletePost} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`flex flex-col w-[16rem]`,
  css`
    display: grid;
    gap: 0.4rem;
    grid-template:
      "picture email email"
      "picture title title"
      ". topics cAt"
      ". video video"
      ". deleteBtn ."
      / 1.5rem 1fr;

    &:hover ${DeleteButton} {
      opacity: 1;
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
    ${CreatedAt} {
      grid-area: cAt;
    }

    ${DeleteButton} {
      grid-area: deleteBtn;
      margin-left: 0.2rem;
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

const Video = styled.video(() => [tw`aspect-video w-full`]);

const AuthorPicture = styled.div(() => [tw``]);

const AuthorEmail = styled.div(() => [
  css`
    font-size: 0.5rem;
    font-weight: 600;
  `,
]);

const CreatedAt = styled.p(() => [tw`italic opacity-20 text-[0.35rem]`]);

export default styled(Content)``;
