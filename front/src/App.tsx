import { Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";
import routes from "./common/browserRoutes";
import ErrorPopup from "./components/ErrorPopup";
import { ProfileContextProvider } from "./context/profileContext";
import CreatePost from "./pages/CreatePost";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useCustomSelector } from "./redux";
import Login from "./sections/Login";
import Navbar from "./sections/Navbar";

const App = () => {
  const { loginFormVisibility, popupMessage } = useCustomSelector(
    (state) => state.main
  );

  return (
    <ProfileContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Wrapper>
              {loginFormVisibility && <Login />}
              {popupMessage && <ErrorPopup popupMessage={popupMessage} />}
              <Navbar />
              <Outlet />
            </Wrapper>
          }
        >
          <Route path={routes.index} element={<Index />} />
          <Route path={routes.createPost} element={<CreatePost />} />
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </ProfileContextProvider>
  );
};

const Wrapper = styled.div(() => [tw`h-screen`]);

export default styled(App)``;
