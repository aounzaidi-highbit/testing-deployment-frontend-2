import React from "react";
import { error } from "../../services/images";

const index =()=> {
  return (
    <div className="my-20 px-4 lg:px-8 mx-auto">
      <div className="flex items-center justify-center">
        <img src={error} alt="404 page" />
      </div>
    </div>
  );
};
export default index