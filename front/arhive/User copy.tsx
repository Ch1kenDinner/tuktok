import { useContext, useRef } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { api, apiRoutes } from "../src/api";
import customEvents from "../src/common/customEvents";
import { convertToBase64 } from "../src/common/helpers";
import { DP } from "../src/common/types";
import { ProfileContext } from "../src/context/profileContext";
import { mainActions } from "../src/redux/mainSlice";

interface Props extends DP {}

const User = (props: Props) => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const profile = useContext(ProfileContext);

  const handleLoginClick = () => {
    dispatch(mainActions.setField({ loginFormVisibility: true }));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleInputChange = async (e) => {
    const file = e.target.files[0];
    const { result: base64 }: any = await convertToBase64(file);
    api.patch(apiRoutes.uploadAvatar, { base64 }).then(({ data }) => {
      if (profile) {
        localStorage.setItem(
          "profile",
          JSON.stringify({ ...profile, user: data.user })
        );
        window.dispatchEvent(new Event(customEvents.localStorageChange));
      }
    });
  };

  if (!profile || !profile.user) {
    return (
      <Wrapper className={props.className}>
        <LoginButton onClick={handleLoginClick}>
          <p>Log In</p>
          <CiLogin />
        </LoginButton>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={props.className}>
      <PictureLabel>
        <MdOutlineEdit />
        <input
          onChange={handleInputChange}
          accept={"image/png, image/jpeg"}
          type="file"
          ref={inputRef}
        />
        <Image src={profile.user.picture} />
      </PictureLabel>
      <Username>{profile.user.email}</Username>
      <LogoutButton onClick={handleLogout}>
        <CiLogout />
      </LogoutButton>
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  tw`flex items-center text-pink-600 h-1/2`,
  css`
    font-size: 0.5em;

    svg {
      margin-bottom: -0.05rem;
    }
  `,
]);

const LoginButton = styled.button(() => [
  tw`flex items-center space-x-1 border-[1px] border-pink-400 rounded-3xl`,
  css`
    padding: 0.2em 0.8em;
  `,
]);

const Username = styled.p(() => [tw``]);

const LogoutButton = styled.button(() => [tw`p-2 rounded-[50%]`]);

const Image = styled.img(() => [tw`object-cover h-full w-auto`]);

const PictureLabel = styled.label(() => [
  tw`relative flex items-center justify-center rounded-[50%] overflow-hidden aspect-square h-full mr-1`,
  css`
    input {
      display: none;
    }

    svg {
      display: none;
      position: absolute;
      margin: 0 auto;
    }

    &:hover svg {
      display: block;
    }
  `,
]);

export default styled(User)``;
