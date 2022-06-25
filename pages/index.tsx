import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Medium Clone</title>
        <link rel="icon" href="/medium-icon.svg" />
      </Head>
    </div>
  );
};

export default Home;
