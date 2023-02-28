import styled, { css } from "styled-components";
import tw from "twin.macro";

export const styles = {
  border: tw`text-pink-600 border-2 border-pink-400 rounded-sm`,
	onDisabled: tw`disabled:(bg-black)`
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
