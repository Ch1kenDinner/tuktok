import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../api";
import routes from "../common/browserRoutes";
import styles from "../common/styles";
import { DP } from "../common/types";
import Input from "../components/Input";
import TopicsInput, { ITopic } from "../components/TopicsInput";
import VideoInput from "../components/VideoInput";
import useFormValidation, {
  defaultValidateRules,
  IRules,
} from "../hooks/useFormValidation";
import { useStateReducer } from "../hooks/useStateReducer";
import { mainActions } from "../redux/mainSlice";

interface IInitState {
  isLoading: boolean;
}

const initState: IInitState = {
  isLoading: false,
};

const rules: IRules<IInitFields> = {
  title: [defaultValidateRules.setMinLength(4)],
  video: [defaultValidateRules.required()],
  topics: [
    {
      isValid: (arr: any[]) => !!arr.length,
      errorMessage: "At least 1 topic required",
    },
  ],
};

interface IInitFields {
  title?: string;
  video?: File;
  topics: ITopic[];
}

const initFields: IInitFields = {
  title: "",
  video: undefined,
  topics: [],
};

const CreatePost = ({ className }: DP) => {
  const [state, setState] = useStateReducer(initState);

  const profile = localStorage.getItem("profile");
  const dispatch = useDispatch();

  const { fields, setFields, errors, isValid } = useFormValidation(
    initFields,
    rules
  );

  if (!profile) {
    dispatch(mainActions.setField({ loginFormVisibility: true }));
    return <Navigate to={routes.index} />;
  }

  const resetForm = () => {
    setFields(initFields);
    setState({ isLoading: false });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid()) return;
    const { title, video, topics } = fields;
    setState({ isLoading: true });
    api
      .post(
        apiRoutes.postPost,
        { title, video, topics },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .catch((err) => {
        console.log("err", err);
        dispatch(
          mainActions.setField({
            popupMessage: {
              message: err.response?.data.message,
              type: "error",
            },
          })
        );
      })
      .then((response: any) => {
        if (response?.status == 200) {
          dispatch(
            mainActions.setField({
              popupMessage: {
                message: response.data?.message,
                type: "success",
              },
            })
          );
        }
      })
      .finally(() => {
        resetForm();
      });
  };

  return (
    <Wrapper>
      <Header>Create post</Header>
      <Form onSubmit={handleSubmit}>
        <Input
          disabled={state.isLoading}
          type={"text"}
          value={fields.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFields({ title: e.target.value });
          }}
          placeholder="Title"
          errorMessage={errors.title}
        />
        <VideoInput
          file={fields.video}
          setFile={(video: File) => setFields({ video })}
          disabled={state.isLoading}
        />
        <TopicsInput
          disabled={state.isLoading}
          topics={fields.topics}
          setTopics={(topics) => setFields({ topics })}
          errorMessage={errors.topics}
        />
        <Button disabled={state.isLoading || !isValid()} type="submit">
          Submit
        </Button>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`flex flex-col items-center mt-1 space-y-2 text-pink-600 `,
  css`
    ${Input} {
      ${styles.border}
    }
    ${VideoInput} {
			${styles.border}
			${tw`py-1`}
		}
  `,
]);

const Header = styled.h1(() => [tw`font-bold`]);

const Form = styled.form(() => [
  tw`flex flex-col space-y-2`,
  css`
    margin: 0 auto;
    width: max(15rem, 40%);
  `,
]);

const Button = styled.button(() => [
  tw`text-pink-600 border-2 border-pink-400 rounded-sm `,
  css`
    font-size: 0.6rem;
    padding: 0.2rem 0.5rem;
  `,
  css`
    &:disabled {
      ${styles.isDisabled}
    }
  `,
]);

export default styled(CreatePost)``;
