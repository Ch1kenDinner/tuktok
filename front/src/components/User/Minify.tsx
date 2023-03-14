import { motion } from "framer-motion";
import React, { useContext } from "react";
import { FiArrowDown } from "react-icons/fi";
import { MdCheck, MdOutlineEdit } from "react-icons/md";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { UserContext } from ".";
import { api, apiRoutes } from "../../api";
import { convertToBase64, setLocalStorage } from "../../common/helpers";
import styles from "../../common/styles";
import { DP } from "../../common/types";
import { ProfileContext } from "../../context/profileContext";
import useFormValidation, {
  defaultValidateRules,
  IRules,
} from "../../hooks/useFormValidation";
import { useStateReducer } from "../../hooks/useStateReducer";
import ImgInput from "../ImgInput";
import Input from "../Input";

interface IInitFields {
  picture?: File;
  username: string;
}

const initFields: IInitFields = {
  picture: undefined,
  username: "",
};

const rules: IRules<IInitFields> = {
  picture: [],
  username: [defaultValidateRules.setMinLength(3)],
};

interface Props extends DP {}

const Minify = (props: Props) => {
  const [state, setState] = useStateReducer({
    isLoading: false,
    pictureUrl: "",
  });
  const { mainState, setMainState } = useContext(UserContext);
  const profile = useContext(ProfileContext);

  const { fields, setFields, errors, isValid } = useFormValidation(
    initFields,
    rules
  );

  const setPicture = async (file: File) => {
    setFields({ picture: file });
    const { result: base64 }: any = await convertToBase64(file);
    setState({ pictureUrl: base64 });
  };

  const handleEdit = () => {
    setFields({ username: profile.user.username });
    setMainState({ isUserEditing: true });
  };

  const handleSave = () => {
    if (isValid()) {
      setState({ isLoading: true });
      api
        .patch(apiRoutes.patchUser(), {
          picture: state.pictureUrl,
          username: fields.username,
        })
        .then(({ data }) => {
          setLocalStorage("profile", {
            ...profile,
            user: data.user,
          });
        })
        .finally(() => {
          setState({ isLoading: false });
          setMainState({ isUserEditing: false });
        });
    }
  };

  const handleOpenMenu = () => {
    setMainState({ isMenuOpened: true });
  };

  return (
    <AnimWrapper
      onClick={handleOpenMenu}
      initial="hidden"
      variants={{
        shown: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
      }}
      animate={mainState.isMenuOpened ? "shown" : "hidden"}
      className={props.className}
    >
      {mainState.isMenuOpened && mainState.isUserEditing ? (
        <>
          {state.pictureUrl ? (
            <Image src={state.pictureUrl} />
          ) : (
            <ImgInput disabled={state.isLoading} setFile={setPicture} />
          )}
          <Input
            disabled={state.isLoading}
            value={fields.username}
            errorMessage={errors.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFields({ username: e.target.value });
            }}
          />
          <IconButton onClick={handleSave}>
            <MdCheck />
          </IconButton>
        </>
      ) : (
        <>
          <Image src={profile.user.picture} />
          <Username>{profile.user.username}</Username>
          {mainState.isMenuOpened ? (
            <IconButton onClick={handleEdit}>
              <MdOutlineEdit />
            </IconButton>
          ) : (
            <IconButton onClick={handleOpenMenu}>
              <FiArrowDown />
            </IconButton>
          )}
        </>
      )}
    </AnimWrapper>
  );
};

const AnimWrapper = styled(motion.div)(() => [
  tw`rounded-3xl cursor-pointer flex items-center w-full gap-x-1 h-full p-[0.1rem]`,
  styles.border,
  css`
    ${Input} {
      ${tw`placeholder:(!text-[0.01rem])`}
      ${styles.border}
      border-style: none none solid none;
      border-radius: 0;
    }
  `,
]);

const IconButton = styled.div(() => [tw`h-full p-1 aspect-square`]);

const Username = styled.p(() => [tw`mr-auto truncate`]);

const Image = styled.img(() => [
  tw`object-cover w-auto h-full aspect-square rounded-3xl`,
]);

export default styled(Minify)``;
