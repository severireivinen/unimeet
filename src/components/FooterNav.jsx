import React from "react";
import { ChatIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/solid";

function FooterNav() {
  return (
    <nav className="flex items-center justify-between px-8 py-2 smlg:hidden">
      <div className="relative h-6 w-6 cursor-pointer">
        <HomeIcon />
      </div>

      <div className="relative h-6 w-6 cursor-pointer">
        <UserGroupIcon />
      </div>
      <div className="relative h-6 w-6 cursor-pointer">
        <ChatIcon />
      </div>
    </nav>
  );
}

export default FooterNav;
