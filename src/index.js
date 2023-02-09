import React from "react";
import ReactDOM from "react-dom/client";
// import styles from "./index.module.scss";
import { BrowserRouter } from "react-router-dom";
import { ProvideWallet } from "./hooks/useWallet";
import { ProvideUpdate } from "./hooks/useUpdate";
import { ProvideQuery } from "./hooks/useQuery";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProvideQuery>
        <ProvideWallet>
          <ProvideUpdate>
            <App />
          </ProvideUpdate>
        </ProvideWallet>
      </ProvideQuery>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
