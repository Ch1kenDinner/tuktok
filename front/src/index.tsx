import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { GlobalStyles as DefaultStyles } from "twin.macro";
import App from "./App";
import { store } from "./redux";

const GlobalStyles = createGlobalStyle`
	html {
		font-family: 'Roboto', sans-serif;
		font-size: clamp(16px, calc(10px + 2vw), 40px);
	}

	:root {
		--gap-x-global: max(2.5%, 1vw);
		--hr-border: 1px solid #b1b1b177;
		--nav-h: 2rem;
	}
`;

export const root = ReactDOM.createRoot(
  document.querySelector("#root") as HTMLDivElement
);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <DefaultStyles />
      <GlobalStyles />
      <App />
    </BrowserRouter>
  </Provider>
);
