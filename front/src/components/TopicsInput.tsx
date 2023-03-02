import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import { capitalize } from "../common/helpers";
import { DPInput } from "../common/types";

export interface ITopic {
  icon?: any;
  title: string;
}

export interface ITopicSelected {
  topic: ITopic;
  isSelected: boolean;
}


interface ITopicsInput extends DPInput {
  onChangeTopics: (topics: ITopic[]) => any;
}

const TopicsInput = ({ className, onChangeTopics, disabled }: ITopicsInput) => {
  const [topics, setTopics] = useState<ITopicSelected[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [opening, setOpening] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTopics = () => {
    setLoading(true);
    api
      .get<{topics: ITopic[]}>(apiRoutes.topics)
      .then(({ data }) => {
        setTopics((prev) => [
          ...prev.filter((el) => el.isSelected),
          ...data.topics.filter((el) => !prev.map((el) => el.topic.title).includes(el.title)).map((el) => ({topic: el, isSelected: false})),
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTagClick = (e) => {
    if (opening) {
      setTopics((prev) =>
        prev
          .map((el) => {
            if (el.topic.title == e.target.innerText.toLowerCase()) {
              return { ...el, isSelected: !el.isSelected };
            }
            return el;
          })
          .sort((a, b) => (a.isSelected ? -1 : 1))
      );
    }
  };

  const handleBlur = (e) => {
    if (
      ![...wrapperRef.current!.getElementsByTagName("*")].includes(e.target)
    ) {
      setOpening(false);
      window.removeEventListener("pointerdown", handleBlur);
    }
  };

  const handleOpen = () => {
    if (disabled) return;
    window.addEventListener("pointerdown", handleBlur);
    setOpening(true);
  };

  const handleAddTag = () => {
    if (inputValue) {
      setTopics((prev) => [
        {
          topic: { title: inputValue.toLowerCase() },
          isSelected: true,
        },
        ...prev.filter((el) => el.topic.title !== inputValue.toLowerCase()),
      ]);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleKeyDown = (e) => {
    if (e.code == "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(() => {
    if (opening) {
      fetchTopics();
      inputRef.current?.focus();
    } else {
      setTopics((prev) => prev.filter((el) => el.isSelected));
      onChangeTopics(topics.filter((el) => el.isSelected).map((el) => el.topic));
    }
  }, [opening]);

  const returnTopics = () => {
    const topicsEls = topics.map((el) => (
      <Tag
        isOpened={opening}
        onClick={handleTagClick}
        isSelected={el.isSelected}
      >
        {capitalize(el.topic.title)}
      </Tag>
    ));
    if (loading) return [...topicsEls, <p>Loading ...</p>];
    if (topics.length === 0) return <p>Not found</p>;
    return topicsEls;
  };

  return (
    <Wrapper ref={wrapperRef} className={className}>
      {opening && (
        <InputWrapper isOpened={opening}>
          <Input
            disabled={disabled}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Topics"
            type={"text"}
          />
          <AddTagButton
            disabled={disabled}
            onClick={handleAddTag}
          ></AddTagButton>
        </InputWrapper>
      )}

      <TagsWrapper onClick={handleOpen} isOpened={opening}>
        {returnTopics()}
      </TagsWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [tw`relative`]);

const InputWrapper = styled.div(({ isOpened }: { isOpened: boolean }) => [
  tw`flex border-2 border-pink-400 rounded-sm`,
  css`
    padding: 0.2rem 0.4rem;
  `,
  isOpened && tw`rounded-b-none`,
]);

const Input = styled.input(() => [
  tw`placeholder:(text-pink-200)`,
  css`
    font-size: 0.5rem;
    flex-grow: 1;
    outline: none;
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
