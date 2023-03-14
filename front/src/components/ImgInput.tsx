import { useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import styled from "styled-components";
import tw from "twin.macro";
import { DP, DPInput } from "../common/types";
import useDrag from "../hooks/useDrag";

interface Props extends DPInput {
  setFile: (fileUrl: File) => void;
}

const ImgInput = (props: Props) => {
  const { isDragging, events } = useDrag(props.setFile);

  const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    props.setFile(file);
  };

  return (
    <Label {...events}>
      <AiOutlineCloudUpload />
      <Input disabled={props.disabled} type="file" accept="image/" onChange={handleSetFile} />
    </Label>
  );
};

const Label = styled.label(() => [
  tw`flex items-center justify-center h-full border-2 border-pink-400 cursor-pointer rounded-3xl aspect-square`,
]);

const Input = styled.input(() => [tw`hidden`]);

export default ImgInput;
