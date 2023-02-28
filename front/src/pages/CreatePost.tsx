import styled from "styled-components";
import tw from "twin.macro";
import { DP } from "../common/types";
import CreatePostForm from "../sections/CreatePostForm";

const CreatePost = ({ className }: DP) => {
  return (
    <Wrapper>
			<Header>Create post</Header>
      <CreatePostForm />
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [tw`flex flex-col items-center mt-1 space-y-2 text-pink-600 `]);

const Header = styled.h1(() => [
	tw`font-bold`
])

export default styled(CreatePost)``;
