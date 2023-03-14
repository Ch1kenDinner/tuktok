import { AiOutlineCloudUpload } from "react-icons/ai";
import styled from "styled-components";
import tw from "twin.macro";
import { DPInput } from "../common/types";
import useDrag from "../hooks/useDrag";

const fileTypes = ["video/mp4", "image/jpeg"];

export interface Props extends DPInput {
  file?: File;
  setFile: (v: File) => void;
  errorMessage?: string;
}

const VideoInput = (props: Props) => {
  const { isDragging, events } = useDrag(props.setFile);

  const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    props.setFile(file);
  };

  return (
    <Label
      isDragging={isDragging}
      disabled={props.disabled}
      className={props.className}
			{...events}
    >
      <>
        <AiOutlineCloudUpload />
        {props.file ? (
          <Text>Uploaded: {props.file.name}</Text>
        ) : (
          <Text>Upload file here</Text>
        )}
        {props.errorMessage && <h1>{props.errorMessage}</h1>}
        <Input
          disabled={props.disabled}
          onChange={handleSetFile}
          accept="video/mp4"
          type={"file"}
        />
      </>
    </Label>
  );
};

const Label = styled.label(
  ({ disabled, isDragging }: { disabled?: boolean; isDragging: boolean }) => [
    tw`flex flex-col items-center justify-center gap-1 text-pink-600 cursor-pointer`,
    isDragging && tw`border-dashed`,
  ]
);

const Text = styled.p(() => [tw`italic text-[0.3rem] text-center`]);

const Input = styled.input(() => [tw`hidden`]);

export default styled(VideoInput)``;
