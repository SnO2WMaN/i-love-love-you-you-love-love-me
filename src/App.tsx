import ky from "ky";
import React from "react";
import { SWRConfig } from "swr";

import { Page as IndexPage } from "./pages/Index";

export const App: React.FC = () => {
  return (
    <SWRConfig
      value={{
        fetcher: (res, init) => ky.get(res, { ...init, timeout: 30000 }).then((res) => res.json()),
      }}
    >
      <IndexPage />
    </SWRConfig>
  );
};
