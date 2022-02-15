import React from "react";
import SocialContainer from "./SocialContainer";

function Sidebar({ user }) {
  return (
    <section className="hidden smlg:flex flex-col w-72 shadow-lg shadow-black">
      {/** Top section */}
      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-bg-pink-500 text-white font-semibold">
        {<img src={user.profileImg} className="w-8 h-8 rounded-full" />}
        <p>{user.name}</p>
      </div>
      {/** MatchContainer / Messages */}
      <SocialContainer />
      <div></div>
    </section>
  );
}

export default Sidebar;
