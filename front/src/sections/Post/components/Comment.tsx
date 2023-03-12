import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { PostContext } from "..";
import { DP } from "../../../common/types";
import { ProfileContext } from "../../../context/profileContext";
import { useStateReducer } from "../../../hooks/useStateReducer";
import { fetchCommentLike, fetchGetComments, fetchPatchComment } from "../api";
import { calcLikeColor, returnUpdatedComments } from "../helpers";
import { IComment } from "../types";

interface Props extends DP {
  comment: IComment;
  index: number;
}

const Comment = (props: Props) => {
  const [state, setState] = useStateReducer({
    isLoading: false,
    isEditing: false,
    editingText: "",
  });
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

  const handleEditText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({ editingText: e.target.value });
  };

	const handleCloseEditing = () => {
		setState({isEditing: false})
	}

  const handleSaveText = () => {
    if (!state.editingText.length) return;
    setState({ isLoading: true });
    fetchPatchComment(props.comment._id, {
      comment: { text: state.editingText },
    })
      .then(({ data, status }) => {
        if (status == 200) {
          setMainState({
            comments: returnUpdatedComments(
              mainState.comments,
              props.comment._id,
              data.comment
            ),
          });
          setState({ isEditing: false });
        }
      })
      .finally(() => {
        setState({ isLoading: false });
      });
  };

  const handleSetEditing = () => {
    setState({ isEditing: true, editingText: props.comment.text });
		setMainState({currentEditingCommentId: props.comment._id})
  };

  const userLikeType = props.comment.reactions.find(
    (el) => el.userId == profile?.user?._id
  );

	useEffect(() => {
    if (mainState.isCommentsHidden && state.isEditing) {
      setState({ isEditing: false });
    }
  }, [mainState.isCommentsHidden]);

	useEffect(() => {
		if (mainState.currentEditingCommentId != props.comment._id) {
			setState({isEditing: false})
		}
	}, [mainState.currentEditingCommentId])

  return (
    <Wrapper className={props.className}>
      <UserPicture src={props.comment.author.picture} />
      <Username>{props.comment.author.email}</Username>
      <Text>
        {state.isEditing ? (
          <EditingTextarea
            value={state.editingText}
            onChange={handleEditText}
          />
        ) : (
          props.comment.text
        )}
      </Text>
      <Date>{dayjs(props.comment.createdAt).format("DD MMMM")}</Date>
      <ActionsWrapper>
        {profile?.user._id == props.comment.author._id && !state.isEditing && (
          <EditButton onClick={handleSetEditing}>
            <MdOutlineEdit />
            <span>Edit</span>
          </EditButton>
        )}
        {state.isEditing && (
          <>
						<CancelButton onClick={handleCloseEditing}>Cancel</CancelButton>
            <SaveButton disabled={state.isLoading} onClick={handleSaveText}>
              Save
            </SaveButton>
          </>
        )}
      </ActionsWrapper>
      <LikesWrapper>
        <LikeButton disabled={state.isLoading} onClick={handleLike("like")}>
          {userLikeType?.reaction === "like" ? (
            <AiFillLike />
          ) : (
            <AiOutlineLike />
          )}
        </LikeButton>
        <LikesCount color={calcLikeColor(props.comment.rating)}>
          {props.comment.rating}
        </LikesCount>
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
      ". text text likes"
      ". date actions ."
      / auto 1fr auto auto;

    @media (hover: hover) {
      ${ActionsWrapper} > * {
        opacity: 0;
      }
      &:hover ${ActionsWrapper} > * {
        opacity: 0.3;
      }
      ${ActionsWrapper} > *:hover {
        opacity: 1;
      }
    }

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
    ${ActionsWrapper} {
      grid-area: actions;
    }
  `,
]);

const UserPicture = styled.img(() => [tw`h-full aspect-square rounded-[50%]`]);

const Username = styled.div(() => [tw`text-[0.7em]`]);

const Text = styled.div(() => [tw`break-all grow text-[0.7em]`]);

const Date = styled.div(() => [tw`opacity-50 text-[0.3rem]`]);

const LikesWrapper = styled.div(() => [
  tw`mb-auto flex-col items-center text-[0.38rem]`,
]);

const LikesCount = styled.div(({ color }: { color: "green" | "red" }) => [
  css`
    text-align: center;
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

const ActionsWrapper = styled.div(() => [
  tw`flex justify-end space-x-1 text-[0.3rem]`,
  css`
    span {
      letter-spacing: 1px;
    }
  `,
]);

const EditingTextarea = styled.textarea(() => [
  tw`w-full h-10 resize-none outline-1 pr-[0.2rem] outline-pink-400`,
  css`
    &::-webkit-scrollbar {
      background: transparent;
      width: 0.2rem;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 1rem;
      ${tw`bg-pink-400`}
    }
  `,
]);

const EditButton = styled.button(() => [tw`flex space-x-0.5 items-center`]);

const SaveButton = styled.button(() => [
  tw`px-1 py-0.5 text-white bg-pink-400 !opacity-100 rounded-3xl`,
]);
const CancelButton = styled.button(() => [
  tw`px-1 border-2 border-pink-400 py-0.5 text-pink-400 !opacity-100 rounded-3xl`,
]);

export default styled(Comment)``;
