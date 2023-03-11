import { createContext, Dispatch } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { DP } from "../../common/types";
import { StateContextProvider } from "../../context/stateContext";
import { useStateReducer } from "../../hooks/useStateReducer";
import { fetchGetComments } from "./api";
import CommentForm from "./CommentForm";
import PostComments from "./Comments";
import PostContent from "./Content";
import { IComment, IPost } from "./types";

interface IInitState {
	post: IPost,
  isDeleted: boolean,
	comments: IComment[]
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
		comments: []
  });

  if (mainState.isDeleted) return <></>;

  return (
    <Wrapper className={props.className}>
      <PostContext.Provider
        value={{mainState, setMainState}}
      >
        <PostContent post={props.post} />
        <CommentsWrapper>
          <PostComments postId={props.post._id} />
          <CommentForm postId={props.post._id} />
        </CommentsWrapper>
      </PostContext.Provider>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [tw``]);

const CommentsWrapper = styled.div(() => [tw``]);

export default styled(Post)``;
