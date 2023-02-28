import { IoAdd } from "react-icons/io5";
import { SiAirplayvideo } from "react-icons/si";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import routes from "../common/routes";
import User from "../components/User";

const Navbar = () => {
  return (
    <Wrapper>
      <LogoLink to={'/'}>
        <SiAirplayvideo />
        <p className="text">TukTok</p>
      </LogoLink>
      <CreatePostLink to={routes.createPost}>
        <span>Create post</span>
        <IoAdd />
      </CreatePostLink>
      <User />
    </Wrapper>
  );
};

const Wrapper = styled.nav(() => [
  tw`flex items-center gap-x-2`,
  css`
    padding: 0 var(--gap-x-global);
    height: var(--nav-h);
    border-bottom: var(--hr-border);

    ${User} {
      margin-left: auto;
    }
  `,
]);

const CreatePostLink = styled(Link)(() => [
  tw`flex space-x-0.5 items-center border-2 font-thin border-pink-400 text-pink-600 rounded-sm`,
  css`
		margin-right: auto;
		padding: 0.1rem 0.4rem;
		font-size: 0.5rem;
    svg {
      margin-bottom: -0.05rem;
    }
  `,
]);

const LogoLink = styled(Link)(() => [
  tw`flex items-center space-x-1 text-pink-600`,
  css`
    font-size: 1em;

    .text {
      font-family: "Phudu", cursive;
      font-weight: 500;
    }

    svg {
      font-size: 0.79em;
      margin-bottom: -3px;
    }
  `,
]);

export default styled(Navbar)``;
