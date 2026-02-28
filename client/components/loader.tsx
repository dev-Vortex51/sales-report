import { LoaderCircle } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center mt-10">
      <LoaderCircle className="animate-spin text-blue-500" size={40} />
    </div>
  );
};

export default Loader;
