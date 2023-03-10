import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api } from "../api";
import customEvents from "../common/customEvents";
import { setLocalStorage } from "../common/helpers";
import styles from "../common/styles";
import { DP } from "../common/types";
import Input from "../components/Input";
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

interface IInitFields {
  email: string;
  password: string;
}

const initFields: IInitFields = {
  email: "",
  password: "",
};

const rules: IRules<IInitFields> = {
  email: [
    defaultValidateRules.required(),
    {
      isValid: (value) => new RegExp(/\w+@\w+\.\w+/).test(value),
      errorMessage: "Invalid format",
    },
  ],
  password: [defaultValidateRules.setMinLength(6)],
};

const Login = ({ className }: DP) => {
  const [state, setState] = useStateReducer(initState);

  const dispatch = useDispatch();
  const { fields, setFields, errors, isValid } = useFormValidation(
    initFields,
    rules
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid()) {
      handleFetchResponse({ email: fields.email, password: fields.password });
    }
  };

  const handleHide = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(mainActions.setField({ loginFormVisibility: false }));
    }
  };

  const handleFetchResponse = (response) => {
    setState({ isLoading: true });
    api
      .post("/login", response)
      .then(({ data }) => {
				setLocalStorage('profile', data)
        dispatch(mainActions.setField({ loginFormVisibility: false }));
      })
      .catch((err) => {
        dispatch(
          mainActions.setField({
            popupMessage: { message: err.response.data.message, type: "error" },
          })
        );
      })
      .finally(() => {
        setState({ isLoading: false });
      });
  };

  useEffect(() => {
    const google = (window as any).google;
    if (google) {
      const googleWrapper = document.getElementById("googleBtn");
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
        callback: handleFetchResponse,
      });
      google.accounts.id.renderButton(googleWrapper, {
        type: "primary",
        shape: "pill",
      });
      // googleWrapper!.querySelector('html')?.setAttribute('style', 'width: 100%')
    }
  }, []);

  return (
    <Wrapper onClick={handleHide} className={className}>
      <Form onSubmit={handleSubmit}>
        <Input
          disabled={state.isLoading}
          value={fields.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFields({ email: e.target.value })
          }
          type="email"
          placeholder="Email"
          errorMessage={errors.email}
        />
        <Input
          disabled={state.isLoading}
          value={fields.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFields({ password: e.target.value })
          }
          type="password"
          placeholder="Password"
          errorMessage={errors.password}
        />
        <SubmitButton disabled={state.isLoading} type="submit">
          Log In
        </SubmitButton>
        <GoogleWrapper id="googleBtn"></GoogleWrapper>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`absolute top-0 bg-[rgba(0, 0, 0, 0.3)] bottom-0 left-0 right-0 z-10 flex items-center justify-center`,
  css`
    ${Input} {
      ${styles.border}
    }
  `,
]);

const Form = styled.form(() => [
  tw`box-content p-5 w-[10rem] space-y-1 bg-white rounded-lg`,
]);

const SubmitButton = styled.button(() => [
  tw`w-full font-bold text-pink-800 text-[0.5rem] px-2 py-1 uppercase`,
  styles.border,
]);

const GoogleWrapper = styled.div(() => [tw`flex justify-center h-3`]);

export default styled(Login)``;
