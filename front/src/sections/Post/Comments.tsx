import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { PostContext } from ".";
import { DP } from "../../common/types";
import { useStateReducer } from "../../hooks/useStateReducer";
import { fetchGetComments } from "./api";
import Comment from "./components/Comment";

interface Props extends DP {}

const Comments = (props: Props) => {
  const [state, setState] = useStateReducer({ isLoading: false });
  const { mainState, setMainState } = useContext(PostContext);

  useEffect(() => {
    fetchGetComments(mainState.post._id).then((comments) =>
      setMainState({ comments })
    );
  }, []);

  if (state.isLoading) return <>LOADING</>;

  return (
    <AnimWrapper
      isCommentsHidden={mainState.isCommentsHidden}
      animate={mainState.isCommentsHidden ? "hidden" : "shown"}
      initial="hidden"
      variants={{
        hidden: { maxHeight: "var(--comment-height)" },
        shown: { maxHeight: "calc(var(--comment-height) * 5)" },
      }}
      className={props.className}
    >
      {mainState.comments.map((el, i) => (
        <Comment index={i} comment={el} key={el._id}>
          {el.text}
        </Comment>
      ))}
    </AnimWrapper>
  );
};

const AnimWrapper = styled(motion.div)(
  ({ isCommentsHidden }: { isCommentsHidden: boolean }) => [
    tw`space-y-3 overflow-hidden`,
    !isCommentsHidden && tw`overflow-y-auto`,
  ]
);

export default styled(Comments)``;
