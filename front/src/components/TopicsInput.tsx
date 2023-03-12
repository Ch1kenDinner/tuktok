import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import { capitalize } from "../common/helpers";
import styles from "../common/styles";
import { DPInput } from "../common/types";
import { useStateReducer } from "../hooks/useStateReducer";

export interface ITopic {
  icon?: any;
  title: string;
}

interface IInitState {
  unselectedTopics: ITopic[];
  inputValue?: string;
  isOpened: boolean;
  isLoading: boolean;
}

const initState: IInitState = {
  unselectedTopics: [],
  isOpened: false,
  isLoading: false,
};

interface Props extends DPInput {
  errorMessage?: string;
  topics: ITopic[];
  setTopics: (val: ITopic[]) => void;
}

const TopicsInput = (props: Props) => {
  const [state, setState] = useStateReducer(initState);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTopics = () => {
    setState({ isLoading: true });
    api
      .get<{ topics: ITopic[] }>(apiRoutes.topics)
      .then(({ data }) => {
        const topicsTitle = props.topics.map((el) => el.title);
        setState({
          unselectedTopics: data.topics.filter(
            (el) => !topicsTitle.includes(el.title)
          ),
        });
      })
      .finally(() => {
        setState({ isLoading: false });
      });
  };

  const toSelected = (topic: ITopic) => {
    props.setTopics([...props.topics, topic]);
    setState({
      unselectedTopics: state.unselectedTopics.filter(
        (el) => el.title != topic.title
      ),
    });
  };

  const toUnselected = (topic: ITopic) => {
    setState({
      unselectedTopics: [topic, ...state.unselectedTopics],
    });
    props.setTopics(props.topics.filter((el) => el.title != topic.title));
  };

  const handleTagClick = (e) => {
    if (state.isOpened) {
      const unselectedTarget = state.unselectedTopics.find(
        (el) => el.title == e.target.innerText.toLowerCase()
      );
      if (unselectedTarget) {
        toSelected(unselectedTarget);
      } else {
        const selectedTarget = props.topics.find(
          (el) => el.title == e.target.innerText.toLowerCase()
        );
        if (selectedTarget) {
          toUnselected(selectedTarget);
        }
      }
    }
  };

  const handleBlur = (e) => {
    if (
      ![...wrapperRef.current!.getElementsByTagName("*")].includes(e.target)
    ) {
      setState({ isOpened: false });
      window.removeEventListener("pointerdown", handleBlur);
    }
  };

  const handleOpen = () => {
    if (state.isLoading) return;
    window.addEventListener("pointerdown", handleBlur);
    setState({ isOpened: true });
    return () => window.removeEventListener("pointerdown", handleBlur);
  };

  const handleAddTag = () => {
    if (state.inputValue) {
      const unselectedExistingTopic = state.unselectedTopics.find(
        (el) => el.title == state.inputValue?.toLowerCase()
      );
      if (unselectedExistingTopic) {
        toSelected(unselectedExistingTopic);
        setState({ inputValue: "" });
        return;
      }

      const selectedExistingTopic = props.topics.find(
        (el) => el.title == state.inputValue?.toLowerCase()
      );
      if (selectedExistingTopic) {
        props.setTopics([
          { title: state.inputValue },
          ...props.topics.filter(
            (el) => el.title != state.inputValue?.toLowerCase()
          ),
        ]);
        setState({ inputValue: "" });
        return;
      }
      props.setTopics([{ title: state.inputValue }, ...props.topics]);
      setState({ inputValue: "" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ inputValue: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.code == "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(() => {
    if (state.isOpened) {
      fetchTopics();
      inputRef.current?.focus();
    }
  }, [state.isOpened]);

  const returnTopics = () => {
    const selectedEls = props.topics.map((el) => (
      <Tag isOpened={state.isOpened} onClick={handleTagClick} isSelected={true}>
        {capitalize(el.title)}
      </Tag>
    ));
    const unselectedEls = state.unselectedTopics.map((el) => (
      <Tag
        isOpened={state.isOpened}
        onClick={handleTagClick}
        isSelected={false}
      >
        {capitalize(el.title)}
      </Tag>
    ));

    if (state.isLoading) return [...selectedEls, <p>Loading ...</p>];
    if (!state.isOpened)
      return selectedEls.length ? selectedEls : <p>Select topics</p>;
    return [...selectedEls, ...unselectedEls];
  };

  return (
    <Wrapper ref={wrapperRef} className={props.className}>
      {state.isOpened && (
        <InputWrapper isOpened={state.isOpened}>
          <Input
            disabled={props.disabled}
            ref={inputRef}
            value={state.inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Topics"
            type={"text"}
          />
          {props.errorMessage && state.isOpened && (
            <ErrorMessage>{props.errorMessage}</ErrorMessage>
          )}
          <AddTagButton
            disabled={props.disabled}
            onClick={handleAddTag}
          ></AddTagButton>
        </InputWrapper>
      )}

      <TagsWrapper onClick={handleOpen} isOpened={state.isOpened}>
        {returnTopics()}
        {props.errorMessage && !state.isOpened && (
          <ErrorMessage>{props.errorMessage}</ErrorMessage>
        )}
      </TagsWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [tw`relative`]);

const InputWrapper = styled.div(({ isOpened }: { isOpened: boolean }) => [
  tw`flex py-[0.2rem] px-[0.4rem]`,
  styles.ring,
  isOpened && tw`rounded-b-none`,
]);

const Input = styled.input(() => [
  tw`text-[0.5rem] grow outline-0 placeholder:(text-pink-200)`,
]);

const ErrorMessage = styled.div(() => [
  tw`text-red-600 ml-auto my-auto text-[0.3rem] whitespace-nowrap`,
  css`
    height: min-content;
  `,
]);

const AddTagButton = styled.button(() => [
  css`
    height: 0.8rem;
    aspect-ratio: 1/1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after,
    &::before {
      content: "";
      position: absolute;
      display: inline-block;
      width: 50%;
      height: 2px;
      ${tw`bg-pink-400`}
    }
    &::after {
      transform: rotate(90deg);
    }
  `,
]);

const TagsWrapper = styled.div(({ isOpened }: { isOpened: boolean }) => [
  tw`flex gap-1 overflow-x-auto bg-white border-2 border-pink-400 rounded-sm`,
  css`
    padding: 0.2rem 0.4rem;

    p {
      font-size: 0.6rem;
      font-style: italic;
      ${tw`text-pink-200`}
    }
  `,
  isOpened &&
    css`
      ${tw`overflow-x-visible border-t-0 rounded-t-none rounded-b-sm`}
      flex-wrap: wrap;
      position: absolute;
      left: 0;
      right: 0;
      min-height: 3rem;
    `,
]);

const Tag = styled.div(
  ({
    isSelected = false,
    isOpened,
  }: {
    isSelected?: boolean;
    isOpened: boolean;
  }) => [
    tw`border-[1px] rounded-2xl border-pink-400 text-pink-600`,
    css`
      font-size: 0.4rem;
      padding: 0.1rem 0.4rem;
      height: min-content;
    `,
    isSelected && tw`text-white bg-pink-600`,
    isOpened && tw`cursor-pointer `,
  ]
);

export default styled(TopicsInput)``;
