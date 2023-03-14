import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { DP } from "../common/types";

const style = {
  circle: css`
    width: 2rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
  `,
};

interface SpinnerProps extends DP {}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <Wrapper>
      <AnimCircle
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 1] }}
      initial={{opacity: 0, scale: 0}}
      transition={{ repeat: Infinity, duration: 0.7, times: [0, 0.4, 1], repeatDelay: 0.3 }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  style.circle,
  css`
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
		transform: translate(-2rem, -3rem);
		opacity: 0.5;
    box-shadow: 0 0 0.1rem 0 rgb(244 114 182 / var(--tw-bg-opacity));
    ${tw`bg-pink-400`}
  `,
]);

const AnimCircle = styled(motion.div)(() => [
  tw`bg-pink-600`,
  style.circle,
  css`
    width: 4em;
    box-shadow: 0 0 0.1em 0.1em rgb(219 39 119 / var(--tw-bg-opacity));
  `,
]);

export default Spinner;
