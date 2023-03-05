import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import { capitalize } from "../common/helpers";
import { DP } from "../common/types";
import { ITopic } from "../components/TopicsInput";
import { useStateReducer } from "../hooks/useCustomReducer";
import { useCustomSelector } from "../redux";
import { mainActions } from "../redux/mainSlice";

interface ITopicSelected {
  topic: ITopic;
  isSelected: boolean;
}

interface IInitState {
  isLoading: boolean;
  topics: ITopicSelected[];
}

const initState: IInitState = {
  isLoading: false,
  topics: [],
};

const Topics = ({ className }: DP) => {
  const [state, setState] = useStateReducer(initState);
  const dispatch = useDispatch();
  const { searchingTopics } = useCustomSelector((state) => state.main);

  const fetchTopics = async () => {
    setState({ isLoading: true });
    api
      .get<{ topics: ITopic[] }>(apiRoutes.topics)
      .then(({ data }) => {
        setState({
          topics: data.topics.map((el) => ({
            topic: el,
            isSelected: false,
          })),
        });
      })
      .finally(() => {
        setState({ isLoading: false });
      });
  };

  const handleItemClick = (e) => {
    if (e.target.innerText) {
      const currentTopic = e.target.innerText.toLowerCase();
      let topics: string[];
      if (searchingTopics.includes(currentTopic)) {
        topics = searchingTopics.filter((el) => el !== currentTopic);
      } else {
        topics = [...searchingTopics, currentTopic];
      }
      setState({
        topics: state.topics.map((el) => {
          if (topics.includes(el.topic.title)) {
            return { topic: el.topic, isSelected: true };
          }
          return { topic: el.topic, isSelected: false };
        }),
      });
      dispatch(
        mainActions.setField({
          searchingTopics: topics,
        })
      );
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const returnList = () => {
    if (state.isLoading) return <h3>Loading</h3>;
    if (state.topics.length === 0) return <h3>Not Found</h3>;
    return (
      <List>
        {state.topics.map((el) => (
          <Item isSelected={el.isSelected} onClick={handleItemClick}>
            {capitalize(el.topic.title)}
          </Item>
        ))}
      </List>
    );
  };

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

const Item = styled.button(({ isSelected }: { isSelected: boolean }) => [
  tw`border-[1px] rounded-2xl border-pink-400 text-pink-600`,
  css`
    font-size: 0.4rem;
    padding: 0.1rem 0.4rem;
    height: min-content;
  `,
  isSelected && tw`text-white bg-pink-600`,
]);

export default styled(Topics)``;
