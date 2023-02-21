import { useEffect } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import useCustomState from "../hooks/useCustomState";

interface IInitState {
	loading: boolean,
	data: any[]
}

const initState: IInitState = {
  loading: false,
  data: [],
};

const Topics = () => {
  const state = useCustomState(initState);

  const fetchTopics = async () => {
    state.loading = true;
    api
      .get(apiRoutes.topics)
      .then(({ data }) => {
				console.log('data', data)
				state.data = data.topics
			})
      .finally(() => (state.loading = false));
  };

  useEffect(() => {
    fetchTopics();
  }, []);

	
	const returnList = () => {
		if (state.loading) return <h3>Loading</h3>;
		if (state.data.length === 0) return <h3>Not Found</h3>;
		return (
      <List>
        {state.data.map((el) => (
          <Item>{el}</Item>
        ))}
      </List>
    );
	}

  return (
    <Wrapper>
      <h3>Popular topics</h3>
			{returnList()}
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`flex flex-col flex-wrap gap-1`,
  css`
		--text-clr: rgba(0, 0, 0, 0.4);

    font-size: 1rem;

		h3 {
			font-size: 0.45rem;
			font-weight: bold;
			color: var(--text-clr);
		}
  `,
]);

const List = styled.ul(() => [tw`flex gap-2`]);

const Item = styled.button(() => [
  tw`flex items-center text-pink-400 border-2 border-pink-600 rounded-3xl`,
  css`
    padding: 0.5em;
  `,
]);

export default styled(Topics)``;
