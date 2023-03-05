import styled, { css } from "styled-components";
import tw from "twin.macro";

export const styles = {
  border: tw`border-2 border-pink-400 rounded-sm`,
	isDisabled: tw`text-pink-200 border-pink-200`
};

export const Input = styled.input(() => [
  tw`w-full placeholder:(text-pink-200)`,
  styles.border,
  css`
    outline: none;
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
  `,
]);
