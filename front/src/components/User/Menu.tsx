import { motion } from "framer-motion";
import { useContext } from "react";
import { CiLogout } from "react-icons/ci";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { UserContext } from ".";
import styles from "../../common/styles";
import { DP } from "../../common/types";

interface Props extends DP {}

const Menu = (props: Props) => {
  const { mainState, setMainState } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AnimMenuWrapper
      className={props.className}
      variants={{
        hidden: { height: 0, borderWidth: 0, padding: 0 },
        shown: { height: "auto", borderWidth: "0.05rem" },
      }}
      initial="hidden"
      animate={mainState.isMenuOpened ? "shown" : "hidden"}
    >
      <MenuItems>
        <MenuItem>
          <MenuItemButton>My Posts</MenuItemButton>
        </MenuItem>
        <MenuItem>
          <MenuItemButton>Favorite Posts</MenuItemButton>
        </MenuItem>
        <MenuItem>
          <MenuItemButton>Subscribes</MenuItemButton>
        </MenuItem>
      </MenuItems>
      <LogoutButton onClick={handleLogout}>
        <span>Logout</span>
        <CiLogout />
      </LogoutButton>
    </AnimMenuWrapper>
  );
};

const AnimMenuWrapper = styled(motion.div)(() => [
  tw`bg-white p-[0.1rem] absolute w-full z-10 overflow-hidden flex flex-col items-center`,
  styles.border,
  css`
    border-style: none solid solid solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `,
]);

const MenuItems = styled.ul(() => [tw`my-1 flex gap-y-0.5 flex-col justify-end w-full`]);

const MenuItem = styled.li(() => [
  tw`flex w-full`,
  css`
    &:hover ${MenuItemButton} {
      ${tw`text-white bg-pink-400`}
    }
  `,
]);

const MenuItemButton = styled.button(() => [
  tw`px-1 mx-auto py-0.5 rounded-3xl`,
]);

const LogoutButton = styled.button(() => [
  tw`flex items-center p-1 mx-auto mt-auto space-x-1 rounded-md`,
]);

export default styled(Menu)``;
