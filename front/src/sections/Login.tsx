import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api } from "../api";
import { Input, styles } from "../common/components";
import { DP } from "../common/types";
import useCustomState from "../hooks/useCustomState";
import { mainActions } from "../redux/mainSlice";

interface IInitState {
	isLoading: boolean
}

const initState: IInitState = {
	isLoading: false
}

const Login = ({ className }: DP) => {
  const dispatch = useDispatch();
	const state = useCustomState(initState)
	

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = e.target;
    handleFetchResponse({ email: email.value, password: password.value });
  };

  const handleHide = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(
        mainActions.setField({ field: "loginFormVisibility", value: false })
      );
    }
  };

  const handleFetchResponse = (response) => {
		state.isLoading = true
    api.post("/login", response).then(({ data }) => {
      localStorage.setItem("profile", JSON.stringify(data));
      dispatch(
        mainActions.setField({ field: "loginFormVisibility", value: false })
      );
    }).finally(() => {state.isLoading = false});
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
        <Input disabled={state.isLoading} name={"email"} type="email" placeholder="Email" />
        <Input disabled={state.isLoading} name={"password"} type='password' placeholder="Password" />
        <SubmitButton disabled={state.isLoading} type='submit'>Log In</SubmitButton>
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
  tw`p-5 space-y-1 bg-white rounded-lg`,
  css`
    width: max(10rem, 33vw);
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
