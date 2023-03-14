import { css } from "styled-components";
import tw from "twin.macro";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ring: tw`rounded-sm ring-pink-400 ring-2`,
  border: tw`border-[0.05rem] border-pink-400 rounded-sm`,
  border_sm: tw`border-pink-400 rounded-sm border-[0.02rem]`,
  isDisabled: tw`text-pink-200 border-pink-200`,
  ring_inset: css`
    box-shadow: inset 0 0 0 1.5px;
  `,
};
