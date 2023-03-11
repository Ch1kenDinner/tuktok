import { useContext } from "react";
import styled, {css} from "styled-components";
import tw from "twin.macro";
import { PostContext } from ".";
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
  const {mainState, setMainState } = useContext(PostContext);

  const handleSubmit = () => {
    setState({ isLoading: true });
    fetchPostComment(props.postId, {
      comment: { text: state.inputValue },
    }).then((comments) => {
      setMainState({ comments });
    });
  };

  return (
    <Wrapper className={props.className}>
      <Input
        placeholder="Text"
        value={state.inputValue}
        onChange={(e) => {
          setState({ inputValue: e.target.value });
        }}
        type="text"
      />
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`flex box-content px-2 space-x-1 rounded-3xl ring-2 text-[0.5rem] ring-pink-600`,
]);

const Input = styled.input(() => [
  tw`w-full my-1 text-[1em] text-pink-400 placeholder:(text-pink-600 text-[0.8em] font-bold opacity-20) outline-0`,
]);

const SubmitButton = styled.button(() => [
  tw`text-pink-400 uppercase font-bold text-[0.7em]`,
]);

export default styled(CommentForm)``;
