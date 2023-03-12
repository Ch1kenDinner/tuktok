import { motion } from "framer-motion";
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
    <AnimWrapper variants={{hidden: {maxHeight: 'var(--comment-height)'}, shown: {height: 'auto'}}} className={props.className}>
      {mainState.comments.map((el, i) => (
        <Comment index={i} comment={el} key={el._id}>{el.text}</Comment>
      ))}
    </AnimWrapper>
  );
};

const AnimWrapper = styled(motion.div)(() => [tw`space-y-3 overflow-hidden`]);

export default styled(Comments)``;
