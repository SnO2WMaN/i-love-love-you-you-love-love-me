import "~/styles/main.css";

import ky from "ky";
import { AppProps } from "next/app";
import React from "react";
import { SWRConfig } from "swr";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ fetcher: (url) => ky.get(url).json() }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
};

export default MyApp;
