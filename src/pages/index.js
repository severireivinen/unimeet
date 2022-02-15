import Head from "next/head";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CardSwiper from "../components/CardSwiper";
import FooterNav from "../components/FooterNav";
import { getSession } from "next-auth/client";

export default function Home({ userProfile }) {
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
      <CardSwiper users={[]} />

      {/**Navigation for mobile */}
      <FooterNav />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  } else {
    const res = await fetch(
      `http://localhost:3000/api/verify-profile/${session.user.id}`,
      { method: "GET" }
    );

    if (!res.ok) {
      return {
        redirect: {
          permanent: false,
          destination: "/finalize",
        },
      };
    } else {
      const res = await fetch(
        `http://localhost:3000/api/users/${session.user.id}`
      );

      if (res.status !== 200) {
        console.error("Unable to get user details");
        return {
          redirect: {
            permanent: false,
            destination: "/auth/signin",
          },
        };
      } else {
        const data = await res.json();
        return {
          props: {
            userProfile: data,
          },
        };
      }
    }
  }

  /*return {
    props: {
      session,
    },
  };*/
}
