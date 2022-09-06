import ky from "ky";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";

import { Page as IndexPage } from "./pages/Index";

export const App: React.FC = () => {
  return (
    <SWRConfig
      value={{
        fetcher: (res, init) => ky.get(res, { ...init }).then((res) => res.json()),
      }}
    >
      <BrowserRouter>
        <IndexPage />
      </BrowserRouter>
    </SWRConfig>
  );
};
