import Head from "next/head";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CardSwiper from "../components/CardSwiper";
import FooterNav from "../components/FooterNav";
import { getSession } from "next-auth/react";

export default function Home({ userProfile }) {
  //console.log(userProfile);

  return (
    <div className="bg-gray-100 flex flex-col smlg:flex-row min-h-screen overflow-hidden">
      <Head>
        <title>Unimeet</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/**Header */}
      <Header />

      {/**Sidebar for desktop */}
      <Sidebar user={userProfile} />

      {/**Cardswiper */}
      <CardSwiper />

      {/**Navigation for mobile */}
      <FooterNav />
    </div>
  );
}

// To check if the user is singed up and made a profile
export async function getServerSideProps(context) {
  const session = await getSession(context);

  // Not signed in
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  } else {
    const res = await fetch(
      `http://localhost:3000/api/auth/verify/${session.user.id}`
    );

    const data = await res.json();

    // No profile created
    if (data.noProfile) {
      return {
        redirect: {
          permanent: false,
          destination: "/finalize",
        },
      };
      // Profile created
    } else {
      return {
        props: {
          userProfile: data,
        },
      };
    }
  }
}
