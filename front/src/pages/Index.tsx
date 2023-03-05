import styled, { css } from "styled-components";
import Info from "../sections/Info";
import Posts from "../sections/Posts";

const Index = () => {
  return (
    <Wrapper>
      <Info />
      <Posts />
    </Wrapper>
  );
};

const Wrapper = styled.div(() => [
  css`
    height: calc(100vh - var(--nav-h));
    display: grid;
    grid-template-columns: 1fr 3fr;
  `,
]);

export default styled(Index)``;
