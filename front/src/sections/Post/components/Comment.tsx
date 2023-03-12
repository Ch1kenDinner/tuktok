import dayjs from "dayjs";
import { useContext, useMemo } from "react";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { PostContext } from "..";
import { DP } from "../../../common/types";
import { ProfileContext } from "../../../context/profileContext";
import { useStateReducer } from "../../../hooks/useStateReducer";
import { fetchCommentLike, fetchGetComments } from "../api";
import { calcLikeColor } from "../helpers";
import { IComment } from "../types";

interface Props extends DP {
  comment: IComment;
  index: number;
}

const Comment = (props: Props) => {
  const [state, setState] = useStateReducer({ isLoading: false });
  const profile = useContext(ProfileContext);
  const { mainState, setMainState } = useContext(PostContext);

  const handleLike = (reaction: "like" | "dislike") => async () => {
    setState({ isLoading: true });
    fetchCommentLike(reaction, props.comment._id).then(({ status }) => {
			if (status == 200)
      fetchGetComments(mainState.post._id)
        .then((comments) => setMainState({ comments }))
        .finally(() => {
          setState({ isLoading: false });
        });
    });
  };

  const userLikeType = props.comment.reactions.find(
    (el) => el.userId == profile?.user?._id
  );

  const commentRating = props.comment.reactions.reduce((prev, curr) => {
    if (curr.reaction === "like") {
      return prev + 1;
    } else if (curr.reaction === "dislike") {
      return prev - 1;
    }
  }, 0);

  return (
    <Wrapper className={props.className}>
      <UserPicture src={props.comment.author.picture} />
      <Username>{props.comment.author.email}</Username>
      <Text>{props.comment.text}</Text>
      <Date>{dayjs(props.comment.createdAt).format("DD MMMM")}</Date>
      <LikesWrapper>
        <LikeButton disabled={state.isLoading} onClick={handleLike("like")}>
          {userLikeType?.reaction === "like" ? (
            <AiFillLike />
          ) : (
            <AiOutlineLike />
          )}
        </LikeButton>
        <LikesCount color={calcLikeColor(commentRating)}>{commentRating}</LikesCount>
        <DislikeButton
          disabled={state.isLoading}
          onClick={handleLike("dislike")}
        >
          {userLikeType?.reaction === "dislike" ? (
            <AiFillDislike />
          ) : (
            <AiOutlineDislike />
          )}
        </DislikeButton>
      </LikesWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`text-[0.5rem] items-center overflow-auto space-x-1.5`,
  css`
    display: grid;
    grid-template:
      "userPic userName . likes" 0.8rem
      ". text date likes"
      / auto 1fr auto auto;

    ${UserPicture} {
      grid-area: userPic;
    }
    ${Username} {
      grid-area: userName;
    }
    ${Text} {
      grid-area: text;
    }
    ${Date} {
      grid-area: date;
    }
    ${LikesWrapper} {
      grid-area: likes;
    }
  `,
]);

const UserPicture = styled.img(() => [tw`h-full aspect-square rounded-[50%]`]);

const Username = styled.div(() => [tw`text-[0.7em]`]);

const Text = styled.div(() => [tw`grow text-[0.7em]`]);

const Date = styled.div(() => [tw` text-[0.3rem]`]);

const LikesWrapper = styled.div(() => [
  tw`flex flex-col items-center text-[0.38rem]`,
]);

const LikesCount = styled.div(({ color }: { color: "green" | "red" }) => [
  css`
    color: ${color};
  `,
]);

const LikeButton = styled.button(() => [
  tw`cursor-pointer disabled:(opacity-20)`,
  css`
    svg {
      margin: 0.125em;
    }
  `,
]);

const DislikeButton = styled.button(() => [
  tw`cursor-pointer disabled:(opacity-20)`,
  css`
    svg {
      margin: 0.125em;
    }
  `,
]);

export default styled(Comment)``;
