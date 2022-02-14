import React from "react";
//import { useRecoilState } from "recoil";
//import { signInModalState, registerModalState } from "../../atoms/modals";
import SignInModal from "../../components/SignInModal";
import RegisterModal from "../../components/RegisterModal";
import { getProviders, signIn } from "next-auth/client";

export default function SignIn({ providers }) {
  //const [openSignIn, setOpenSignIn] = useRecoilState(signInModalState);
  //const [openRegister, setOpenRegister] = useRecoilState(registerModalState);

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: "url('../background.jpg')",
      }}
      className="min-h-screen flex flex-col items-center justify-around"
    >
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
        {/*<button
          onClick={() => setOpenSignIn(true)}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-bg-pink-500 text-white rounded-full py-3 px-10 md:px-20 lg:px-40 font-semibold transition ease-in-out hover:scale-105"
        >
          Kirjaudu sisään
        </button>
        <button
          className="bg-white text-purple-500 rounded-full py-3 px-10 md:px-20 lg:px-40 font-semibold transition ease-in-out hover:scale-105"
          onClick={() => setOpenRegister(true)}
        >
          Luo tili
        </button>*/}
      </div>
      {/*<SignInModal />
      <RegisterModal />*/}
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
