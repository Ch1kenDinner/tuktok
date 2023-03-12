import { useEffect, useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import styles from "../common/styles";
import { DPButton } from "../common/types";
import { useStateReducer } from "../hooks/useStateReducer";

interface Props extends DPButton {
  onConfirm: () => void;
}

const DeleteButton = (props: Props) => {
  const [state, setState] = useStateReducer<{ isConfirmFieldVisible: boolean }>(
    { isConfirmFieldVisible: false }
  );
  const confirmWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    setState({ isConfirmFieldVisible: true });
  };

  const handleClose = () => {
    setState({ isConfirmFieldVisible: false });
  };

  const handleClickOutside = ({ target }: PointerEvent) => {
    if (!confirmWrapperRef.current?.contains(target as Node)) {
      handleClose();
    }
  };

  const onConfirm = () => {
    props.onConfirm();
    handleClose();
  };

  useEffect(() => {
    if (state.isConfirmFieldVisible) {
      document.addEventListener("pointerdown", handleClickOutside);
    } else {
      document.removeEventListener("pointerdown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [state.isConfirmFieldVisible]);

  return (
    <Wrapper isOpen={state.isConfirmFieldVisible} className={props.className}>
      {state.isConfirmFieldVisible ? (
        <ConfirmWrapper ref={confirmWrapperRef}>
          <ConfirmMessage>Delete post?</ConfirmMessage>
          <ConfirmButton disabled={props.disabled} onClick={onConfirm}>
            Yes
          </ConfirmButton>
          <ConfirmButton disabled={props.disabled} onClick={handleClose}>
            No
          </ConfirmButton>
        </ConfirmWrapper>
      ) : (
        <Button disabled={props.disabled} onClick={handleOpen}>
          <MdDeleteOutline />
        </Button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div(({ isOpen }: { isOpen: boolean }) => [
  tw`text-[0.4rem] opacity-30`,
  isOpen && tw`opacity-100`,
  !isOpen &&
    css`
      ${Button}:hover {
        ${styles.ring}
      }
    `,
]);

const Button = styled.button(() => [tw`text-inherit px-1 h-3 text-[0.5rem]`]);

const ConfirmWrapper = styled.div(() => [
  tw`flex items-center space-x-[0.2rem] px-1 h-3 `,
  styles.ring,
]);

const ConfirmMessage = styled.p(() => [tw``]);

const ConfirmButton = styled.button(() => [tw`relative h-full px-1`]);

export default styled(DeleteButton)``;
