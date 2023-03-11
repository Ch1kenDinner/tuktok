import { useEffect } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import { DP } from "../common/types";
import Spinner from "../components/Spinner";
import { useStateReducer } from "../hooks/useStateReducer";
import { useCustomSelector } from "../redux";
import Post from "./Post";
import { IPost } from "./Post/types";



interface IInitState {
  posts: IPost[];
  isLoading: boolean;
}

const initState: IInitState = {
  posts: [],
  isLoading: false,
};

const Posts = ({ className }: DP) => {
  const [state, setState] = useStateReducer(initState);
  const { searchingTopics } = useCustomSelector((state) => state.main);

  const fetchGetPosts = () => {
    setState({ isLoading: true });
    api
      .get(apiRoutes.getPosts)
      .then(({ data }) => {
        setState({ posts: data.posts });
      })
      .finally(() => {
        setState({ isLoading: false });
      });
  };

  const fetchGetPostsByTopics = async () => {
    setState({ isLoading: true });
    const { data } = await api.post(apiRoutes.getPostsByTopics, {
      topics: searchingTopics,
    });
    setState({ isLoading: false, posts: data.posts });
  };

  useEffect(() => {
    fetchGetPosts();
  }, []);

  useEffect(() => {
    if (searchingTopics.length) {
      fetchGetPostsByTopics();
    } else {
      fetchGetPosts();
    }
  }, [searchingTopics]);

  if (state.isLoading) return <Spinner />;
  if (!state.posts || !state.posts.length)
    return <NotFound>Not found</NotFound>;

  return (
    <Wrapper className={className}>
      {state.posts.map((el) => (
        <Post key={el._id} post={el} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`flex flex-col items-center overflow-y-auto`,
  css`
    ${Post}:first-child {
      padding: 1rem 0;
    }
    ${Post}:last-child {
      margin-bottom: 0.5rem;
    }
    ${Post} + ${Post} {
      border-top: var(--hr-border);
      padding: 1rem 0;
    }
  `,
]);

const NotFound = styled.p(() => [tw`text-[0.5rem] italic opacity-30`]);

export default styled(Posts)``;
