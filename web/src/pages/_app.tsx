import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import Layout from "~/pages/(components)/Layout";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </div>
  );
};

export default MyApp;
