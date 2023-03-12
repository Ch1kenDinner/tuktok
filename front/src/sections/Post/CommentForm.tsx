import { motion } from "framer-motion";
import { useContext } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { PostContext } from ".";
import styles from "../../common/styles";
import { DP } from "../../common/types";
import { useStateReducer } from "../../hooks/useStateReducer";
import { fetchPostComment } from "./api";

interface Props extends DP {
  postId: string;
}

const CommentForm = (props: Props) => {
  const [state, setState] = useStateReducer({
    inputValue: "",
    isLoading: false,
  });
  const { mainState, setMainState } = useContext(PostContext);

  const handleSubmit = () => {
    setState({ isLoading: true });
    fetchPostComment(props.postId, {
      comment: { text: state.inputValue },
    }).then((comments) => {
      setMainState({ comments });
    });
  };

  return (
    <AnimWrapper variants={{hidden: {height: 0}, shown: {}}} className={props.className}>
      <Textarea
        placeholder="Text"
        value={state.inputValue}
        onChange={(e) => {
          setState({ inputValue: e.target.value });
        }}
      />
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </AnimWrapper>
  );
};

const AnimWrapper = styled(motion.div)(() => [tw`overflow-hidden flex flex-col box-content text-[0.5rem]`]);

const Textarea = styled.textarea(() => [
  tw`w-full p-1 resize-none text-[1em] text-pink-400 placeholder:(text-pink-600 text-[0.8em] font-bold opacity-20) outline-0`,
  styles.border,
  css`
    &::-webkit-scrollbar {
      display: none;
    }
  `,
]);

const SubmitButton = styled.button(() => [
  tw`text-white bg-pink-400 ml-auto mt-1 rounded-3xl p-1 px-2 uppercase font-bold text-[0.7em]`,
]);

export default styled(CommentForm)``;
