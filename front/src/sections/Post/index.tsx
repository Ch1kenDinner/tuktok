import { createContext, Dispatch } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { DP } from "../../common/types";
import { useStateReducer } from "../../hooks/useStateReducer";
import CommentForm from "./CommentForm";
import PostComments from "./Comments";
import PostContent from "./Content";
import { IComment, IPost } from "./types";

interface IInitState {
  post: IPost;
  isDeleted: boolean;
  comments: IComment[];
	isCommentsHidden: boolean
}

export const PostContext = createContext<{
  mainState: IInitState;
  setMainState: Dispatch<Partial<IInitState>>;
}>(null);

interface PostProps extends DP {
  post: IPost;
}

const Post = (props: PostProps) => {
  const [mainState, setMainState] = useStateReducer<IInitState>({
    post: props.post,
    isDeleted: false,
    comments: [],
		isCommentsHidden: true
  });

  if (mainState.isDeleted) return <></>;

  return (
    <Wrapper className={props.className}>
      <PostContext.Provider value={{ mainState, setMainState }}>
        <PostContent post={props.post} />
        <CommentsWrapper>
          <CommentForm postId={props.post._id} />
          <Hr />
          <PostComments postId={props.post._id} />
        </CommentsWrapper>
      </PostContext.Provider>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  css`
    --user-picture-column-width: 1.5rem;
    --gap: 0.4rem;
  `,
]);

const Hr = styled.div(() => [
  css`
    margin: 0.5rem 0;
    flex-grow: 1;
    height: 0.03rem;
    border-radius: 50%;
    overflow: hidden;
    ${tw`bg-pink-200`}
  `,
]);

const CommentsWrapper = styled.div(() => [
  tw`ml-[calc(var(--user-picture-column-width) + var(--gap))]`,
]);

export default styled(Post)``;
