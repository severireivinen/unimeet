import React from "react";

function SocialContainer() {
  return (
    <nav className="flex flex-col">
      {/**Buttons */}
      <div className="bg-green-200 flex space-x-3 p-3">
        <button className="font-semibold">Tuttavuudet</button>
        <button className="font-semibold">Viestit</button>
      </div>

      {/**Container for socials */}
      <div className="grid grid-cols-2 lg:grid-cols-3"></div>
    </nav>
  );
}

export default SocialContainer;
