import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api } from "../api";
import { styles } from "../common/components";
import { DP } from "../common/types";
import Input from "../components/Input";
import { useStateReducer } from "../hooks/useCustomReducer";
import useFormValidation, {
  defaultValidateRules,
  IRules,
} from "../hooks/useFormValidation";
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
		console.log('response', response)
    setState({ isLoading: true });
    api
      .post("/login", response)
      .then(({ data }) => {
        localStorage.setItem("profile", JSON.stringify(data));
        dispatch(mainActions.setField({ loginFormVisibility: false }));
      })
      .catch((err) => {
        dispatch(
          mainActions.setField({
            popupMessage: { message: err.response.data.message, type: 'error' },
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
  tw`absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center`,
  css`
    background-color: rgba(0, 0, 0, 0.3);
  `,
]);

const Form = styled.form(() => [
  tw`box-content p-5 space-y-1 bg-white rounded-lg`,
  css`
    width: 10rem;
    /* width: max(10rem, 33vw); */
  `,
]);

const SubmitButton = styled.button(() => [
  tw`w-full text-pink-800 uppercase`,
  styles.border,
  css`
    font-weight: 500;
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
  `,
]);

const GoogleWrapper = styled.div(() => [tw`flex justify-center h-3`]);

export default styled(Login)``;
