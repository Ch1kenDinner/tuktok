import { useCallback, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import { Input } from "../common/components";
import TopicsInput, { ITopic } from "../components/TopicsInput";
import useCustomState from "../hooks/useCustomState";

interface IInitState {
  title: string;
  topics: ITopic[];
  video?: File;
  isLoading: boolean;
}

const initState: IInitState = {
  title: "",
  topics: [],
  video: undefined,
  isLoading: false,
};

const CreatePostForm = () => {
  const state = useCustomState(initState);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, video, topics } = state;
    state.isLoading = true;
    api
      .post(
        apiRoutes.postVideo,
        { title, video, topics },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(({ data }) => console.log(data.message))
      .finally(() => {
        state.isLoading = false;
      });
  };

  const handleSetFile = (e) => {
    state.video = e.target.files[0];
  };

  const handleChangeTopics = useCallback((topics: ITopic[]) => {
    state.topics = topics;
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        disabled={state.isLoading}
        type={"text"}
        value={state.title}
        onChange={(e) => {
          state.title = e.target.value;
        }}
        placeholder="Title"
      />
      <UploadLabel>
        <AiOutlineCloudUpload />
        {state.video ? <span>Uploaded!</span> : <span>Upload file here</span>}
        <input
          disabled={state.isLoading}
          required
          onChange={handleSetFile}
          name="video"
					accept="video/mp4"
          type={"file"}
        />
      </UploadLabel>
      <TopicsInput
        disabled={state.isLoading}
        onChangeTopics={handleChangeTopics}
      />
      <Button disabled={state.isLoading} type="submit">
        Submit
      </Button>
    </Form>
  );
};

const Form = styled.form(() => [
  tw`flex flex-col space-y-2`,
  css`
    margin: 0 auto;
    width: max(15rem, 40%);
  `,
]);

const UploadLabel = styled.label(() => [
  tw`flex items-center justify-center w-full space-x-1 text-pink-600 border-2 border-pink-400 rounded-sm aspect-video`,
  css`
    padding: 0.2rem 0.5rem;

    font-size: 0.8rem;
    span {
      font-style: italic;
    }

    input {
      display: none;
    }

    span,
    svg {
      opacity: 0.3;
    }
  `,
]);

const Button = styled.button(() => [
  tw`text-pink-600 border-2 border-pink-400 rounded-sm `,
  css`
    font-size: 0.6rem;
    padding: 0.2rem 0.5rem;
  `,
]);

export default styled(CreatePostForm)``;
