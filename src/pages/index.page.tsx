import { css } from "@emotion/css";
import { NextPage } from "next";
import Head from "next/head";

export type PageProps = Record<string, unknown>;

const Page: NextPage<PageProps> = (props) => {
  return (
    <>
      <Head>
        <title>i(lyl)2m</title>
      </Head>
      <div className={css({ padding: "16px 24px" })}>
        <span>I love love you you love love me</span>
      </div>
    </>
  );
};
export default Page;
