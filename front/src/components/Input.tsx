import styled from "styled-components";
import tw from "twin.macro";
import { DPInput } from "../common/types";

interface Props extends DPInput {
  errorMessage?: string;
}

const Input = (props: Props) => {
  return (
    <Wrapper className={props.className}>
      <InputEl
        disabled={props.disabled}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      {props.errorMessage && <ErrorMessage>{props.errorMessage}</ErrorMessage>}
    </Wrapper>
  );
};

const Wrapper = styled.div(({ isDisabled }: { isDisabled?: boolean }) => [
  tw`flex px-[0.4rem] py-[0.2rem] text-[0.5rem] min-w-0 items-center space-x-0.5 text-pink-600`,
]);

const InputEl = styled.input(() => [
  tw`outline-0 grow min-w-0 h-full placeholder:(text-pink-200)`,
]);

const ErrorMessage = styled.div(() => [
  tw`text-red-600 text-[0.3rem] whitespace-nowrap`,
]);

export default styled(Input)``;
