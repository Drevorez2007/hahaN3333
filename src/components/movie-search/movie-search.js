import React from "react";
import { Input } from "antd";
import "./movie-search.css";

const Search = ({ value, onInputChange }) => {
  return (
    <div className="header-search">
      <Input
        placeholder="Type to search"
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
};

export default Search;
