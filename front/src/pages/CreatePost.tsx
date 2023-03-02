import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";
import routes from "../common/routes";
import { DP } from "../common/types";
import { mainActions } from "../redux/mainSlice";
import CreatePostForm from "../sections/CreatePostForm";

const CreatePost = ({ className }: DP) => {

	const profile = localStorage.getItem('profile')
	const dispatch = useDispatch()

	if (!profile) {
		dispatch(mainActions.setField({field: 'loginFormVisibility', value: true}))
		return <Navigate to={routes.index} />;
	}

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
