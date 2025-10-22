import React from "react";
import { Input } from "./ui/input";

const SearchBox = () => {
  return (
    <form>
      <Input
        placeholder="Search Here..."
        className="h-9 rounded-full bg-gray-50"
      />
    </form>
  );
};

export default SearchBox;
