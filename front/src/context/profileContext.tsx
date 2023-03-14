import { createContext, PropsWithChildren, useEffect, useState } from "react";
import customEvents from "../common/customEvents";

interface IProfile {
	token?: string,
	user?: {
		picture: string,
		email: string,
		username: string,
		_id: string
	}
}

export const ProfileContext = createContext<IProfile | undefined>({});

interface IProps extends PropsWithChildren {}

export const ProfileContextProvider = ({ children }: IProps) => {
  const [state, setState] = useState<IProfile | undefined>();

  const handleChange = () => {
    const profile = localStorage.getItem("profile");
    if (profile && JSON.parse(profile).token) {
      setState(JSON.parse(profile));
    } else {
      setState(undefined);
    }
  };

  useEffect(() => {
    handleChange();
    window.addEventListener(customEvents.localStorageChange, handleChange);
    return () => {
      window.removeEventListener(customEvents.localStorageChange, handleChange);
    };
  }, []);

  return (
    <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>
  );
};
