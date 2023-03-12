import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import styles from "../common/styles";
import { DP } from "../common/types";
import { mainActions } from "../redux/mainSlice";

export interface IPopupMessage {
  message: string;
  type: "success" | "error";
}

interface Props extends DP {
  popupMessage: IPopupMessage;
}

const animTransition = { duration: 4, times: [0, 0.15, 0.9, 1] };

const ErrorPopup = (props: Props) => {
  const dispatch = useDispatch();

  const handleAnimEnd = () => {
    dispatch(mainActions.setField({ popupMessage: undefined }));
  };

  console.log("props.popupMessage", props.popupMessage);

  return (
    <AnimWrapper
      animate={{ x: ["-110%", "0%", "0%", "-110%"] }}
      transition={animTransition}
      layout
      className={props.className}
      onAnimationComplete={handleAnimEnd}
    >
      <Text>{props.popupMessage.message}</Text>
      <AnimBar
        animate={{ scaleX: [1, 1, 0, 0], originX: 0 }}
        transition={{ ...animTransition, ease: "linear" }}
      ></AnimBar>
    </AnimWrapper>
  );
};

const AnimWrapper = styled(motion.div)(() => [
  styles.ring,
  css`
    --left-spacing: 0.5rem;
    --left: calc(-100% + var(--left-spacing));
    z-index: 9999;
    position: relative;
    padding: 0.2rem 0.4rem;
    width: 7rem;
    min-height: 2rem;
    position: absolute;
    left: var(--left-spacing);
    bottom: 0.5rem;
    background-color: white;

    transform: translateX(calc(-100% - var(--left-spacing)));
  `,
]);

const Text = styled.p(() => [
  tw`text-red-600`,
  css`
    font-size: 0.4rem;
  `,
]);

const AnimBar = styled(motion.div)(() => [
  tw`bg-red-600`,
  css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.1rem;
  `,
]);

export default styled(ErrorPopup)``;
