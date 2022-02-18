import React from "react";
import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-around bg-hero-pattern">
      <h2 className="text-white font-semibold italic text-lg xxs:text-2xl xs:text-3xl md:text-5xl">
        Löydä ihmisiä koulustasi
      </h2>
      <div className="flex flex-col space-y-2">
        {Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-bg-pink-500 text-white rounded-full py-3 px-10 md:px-20 lg:px-40 font-semibold transition ease-in-out hover:scale-105"
          >
            Sign in with {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
