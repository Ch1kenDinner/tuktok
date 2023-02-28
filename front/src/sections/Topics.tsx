import { useEffect } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import { capitalize } from "../common/helpers";
import { DP } from "../common/types";
import { ITopic } from "../components/TopicsInput";
import useCustomState from "../hooks/useCustomState";

interface IInitState {
	loading: boolean,
	data: ITopic[]
}

const initState: IInitState = {
  loading: false,
  data: [],
};

const Topics = ({className}: DP) => {
  const state = useCustomState(initState);

  const fetchTopics = async () => {
    state.loading = true;
    api
      .get<{topics: ITopic[]}>(apiRoutes.topics)
      .then(({ data }) => {
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
          <Item>{capitalize(el.title)}</Item>
        ))}
      </List>
    );
	}

  return (
    <Wrapper className={className}>
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

const List = styled.ul(() => [tw`flex flex-wrap gap-1`]);

const Item = styled.button(() => [
  tw`border-[1px] rounded-2xl border-pink-400 text-pink-600`,
  css`
    font-size: 0.4rem;
    padding: 0.1rem 0.4rem;
    height: min-content;
  `,
]);

export default styled(Topics)``;
