import styled from "styled-components";
import { api, apiRoutes } from "../api";
import useCustomState from "../hooks/useCustomState";

interface IInitState {
  formData: FormData;
  files: string[];
}

const initState: IInitState = {
  formData: new FormData(),
  files: [],
};

const CreatePostForm = () => {
  const state = useCustomState(initState);

  const handleSubmit = () => {
    api
      .post(apiRoutes.postVideo, state.formData)
      .then(() => console.log("postForm done!"));
  };

  const handleSetFile = (e) => {
    state.formData.append("video", e.target.files[0]);
  };

  return (
    <form
      action="http://localhost:5000/video/upload"
      method="POST"
      encType="multipart/form-data"
    >
      <label>
        <input onChange={handleSetFile} name="video" type={"file"} />
      </label>
      <button type="submit">SUBMIT</button>
    </form>
    // <form onSubmit={handleSubmit}>
    //   <label>
    //     <input onChange={handleSetFile} name="video" type={"file"} />
    //   </label>
    //   <button type="submit">SUBMIT</button>
    // </form>
  );
};

export default styled(CreatePostForm)``;
