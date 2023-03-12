import styled, { css } from "styled-components";
import tw from "twin.macro";
import styles from "./styles";

export const Input = styled.input(() => [
  tw`w-full placeholder:(text-pink-200)`,
  styles.ring,
  css`
    outline: none;
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
  `,
]);
