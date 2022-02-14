import React from "react";
import Image from "next/image";

function Header() {
  return (
    <div className="flex items-center justify-between px-2 h-12 smlg:hidden">
      {/**Center */}
      <div className="relative w-24 h-24">
        <Image src="/logotext.png" layout="fill" objectFit="contain" />
      </div>

      {/**Right */}
      {/*<img
        src={session?.user.avatar}
        alt="profile picture"
        className="h-10 w-10 rounded-full cursor-pointer"
      />*/}
    </div>
  );
}

export default Header;
