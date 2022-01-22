import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "@components/layout/header";
import { PageContainer } from "@components/layout/page-container";
import { HomeContent } from "@components/home/home-content";

const Home: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>Fractal Buzz</title>
        <meta
          name="description"
          content="A social experiment that connects Fractal owners in a series of mini-games"
        />
      </Head>
      <PageContainer>
        <Header />
        <HomeContent />
      </PageContainer>
    </>
  );
};

export default Home;
