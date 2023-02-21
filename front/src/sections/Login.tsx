import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api } from "../api";
import { DP } from "../common/types";
import { mainActions } from "../redux/mainSlice";

const styles = {
  border: tw`text-pink-600 border-2 border-pink-400 rounded-sm`,
};

const Login = ({ className }: DP) => {
  const dispatch = useDispatch();

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
		console.log('response', response)
    api.post("/login", response).then(({ data }) => {
      localStorage.setItem("profile", JSON.stringify(data));
      dispatch(
        mainActions.setField({ field: "loginFormVisibility", value: false })
      );
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
        <Input name={"email"} type="email" placeholder="Email" />
        <Input name={"password"} placeholder="Password" />
        <SubmitButton>Log In</SubmitButton>
        <GoogleWrapper id="googleBtn"></GoogleWrapper>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center`,
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

const Input = styled.input(() => [
  tw`w-full placeholder:(text-pink-200)`,
  styles.border,
  css`
    outline: none;
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
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
