import { DragEvent, useEffect, useRef } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import styles from "../common/styles";
import { DPInput } from "../common/types";
import { useStateReducer } from "../hooks/useStateReducer";

export interface Props extends DPInput {
  file?: File;
  setFile: (v: File) => void;
  errorMessage?: string;
}

interface IInitState {
  isDragged: boolean;
  dragOverflowCount: number;
}

const initState: IInitState = {
  isDragged: false,
  dragOverflowCount: 0,
};

const FileInput = (props: Props) => {
  const [state, setState] = useStateReducer(initState);

  const inputRef = useRef<HTMLInputElement>(null);
  const dragOverflowCountRef = useRef(0);

  const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file.type.includes("video/")) return;
    props.setFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverflowCountRef.current++;
    setState({ isDragged: true });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverflowCountRef.current--;
    if (dragOverflowCountRef.current > 0) return;
    setState({ isDragged: false });
  };

  useEffect(() => {
    return () => {
      dragOverflowCountRef.current = 0;
    };
  }, []);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer) return setState({ isDragged: false });

    const file = e.dataTransfer.files[0];
    if (!file.type.includes("video/")) return setState({ isDragged: false });

    props.setFile(file);
    setState({ isDragged: false });
  };

  return (
    <Label
      isDragged={state.isDragged}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      disabled={props.disabled}
      className={props.className}
    >
      <AiOutlineCloudUpload />
      {props.file ? (
        <>
          <span>Uploaded!</span>
          <p>{props.file.name}</p>
        </>
      ) : (
        <span>Upload file here</span>
      )}
      {props.errorMessage && <h1>{props.errorMessage}</h1>}
      <input
        ref={inputRef}
        disabled={props.disabled}
        onChange={handleSetFile}
        accept="video/mp4"
        type={"file"}
      />
    </Label>
  );
};

const Label = styled.label(
  ({ disabled, isDragged }: { disabled?: boolean; isDragged: boolean }) => [
    styles.ring,
    tw`flex flex-col items-center justify-center w-full space-x-1 text-pink-600 aspect-video`,
    css`
      padding: 0.2rem 0.5rem;

      font-size: 0.8rem;
      span,
      p {
        font-style: italic;
      }

      input {
        display: none;
      }

      span,
      svg,
      p {
        opacity: 0.3;
      }

      p {
        font-size: 0.3rem;
        text-align: center;
      }
    `,
    isDragged &&
      css`
        border: 0.1rem dotted rgb(219 39 119 / var(--tw-text-opacity));
      `,
  ]
);

export default FileInput;
