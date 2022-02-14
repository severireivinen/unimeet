import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center py-3">
      <div className="animate-ping bg-red-500 rounded-full h-16 w-16 md:h-32 md:w-32" />
    </div>
  );
}

export default Loader;
