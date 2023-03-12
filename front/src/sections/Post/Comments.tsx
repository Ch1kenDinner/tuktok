import { useContext, useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { PostContext } from ".";
import { DP } from "../../common/types";
import { useStateReducer } from "../../hooks/useStateReducer";
import { fetchGetComments } from "./api";
import Comment from "./components/Comment";

interface Props extends DP {
  postId: string;
}

const Comments = (props: Props) => {
  const [state, setState] = useStateReducer({ isLoading: false });
  const {mainState, setMainState} = useContext(PostContext);

  useEffect(() => {
    fetchGetComments(props.postId).then((comments) =>
      setMainState({ comments })
    );
  }, []);

  if (state.isLoading) return <>LOADING</>;

  return (
    <Wrapper className={props.className}>
      {mainState.comments.map((el, i) => (
        <Comment index={i} comment={el} key={el._id}>{el.text}</Comment>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [tw`my-2 space-y-3`]);

export default styled(Comments)``;
