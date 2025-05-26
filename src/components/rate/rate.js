import React from "react";
import { Rate } from "antd";
import "./rate.css";

const RateStar = ({ onRate, currentRating }) => (
  <Rate allowHalf count={10} value={currentRating} onChange={onRate} />
);

export default RateStar;
