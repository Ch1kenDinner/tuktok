import { motion } from "framer-motion";
import { createContext, Dispatch, useContext, useEffect, useRef } from "react";
import { CiLogin } from "react-icons/ci";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import styles from "../../common/styles";
import { DP } from "../../common/types";
import { ProfileContext } from "../../context/profileContext";
import { useStateReducer } from "../../hooks/useStateReducer";
import { mainActions } from "../../redux/mainSlice";
import Menu from "./Menu";
import Minify from "./Minify";

interface IInitState {
  isMenuOpened: boolean;
  isUserEditing: boolean;
}

const initState: IInitState = {
  isMenuOpened: false,
  isUserEditing: false,
};

export const UserContext = createContext<{
  mainState: IInitState;
  setMainState: Dispatch<Partial<IInitState>>;
}>(null);

interface Props extends DP {}

const User = (props: Props) => {
  const [mainState, setMainState] = useStateReducer(initState);
  const dispatch = useDispatch();
  const profile = useContext(ProfileContext);

	const wrapperRef = useRef<HTMLDivElement | null>(null)

  const handleLoginClick = () => {
    dispatch(mainActions.setField({ loginFormVisibility: true }));
  };

	const handleCloseMenu = (e) => {
		if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
			setMainState({isMenuOpened: false, isUserEditing: false})
		}
	}

	useEffect(() => {
		if (mainState.isMenuOpened) {
			window.addEventListener("pointerdown", handleCloseMenu);
		}
		return () => {window.removeEventListener('pointerdown', handleCloseMenu)}
	}, [mainState.isMenuOpened]);

  if (!profile || !profile.user) {
    return (
      <AnimWrapper ref={wrapperRef} className={props.className}>
        <LoginButton onClick={handleLoginClick}>
          <p>Log In</p>
          <CiLogin />
        </LoginButton>
      </AnimWrapper>
    );
  }

  return (
    <AnimWrapper
      ref={wrapperRef}
      initial="hidden"
      animate={mainState.isMenuOpened ? "shown" : "hidden"}
      className={props.className}
    >
      <UserContext.Provider value={{ mainState, setMainState }}>
        <Minify />
        <Menu />
      </UserContext.Provider>
    </AnimWrapper>
  );
};

const AnimWrapper = styled(motion.div)(() => [
  tw`text-pink-600 bg-white w-[8rem] h-2/3 relative text-[0.5em]`,
  css`
    svg {
      margin-bottom: -0.05rem;
    }
  `,
]);

const LoginButton = styled.button(() => [
  tw`flex items-center py-1 px-2 space-x-1 my-auto ml-auto border-[0.05rem] border-pink-400 rounded-3xl`,
]);

export default styled(User)``;
