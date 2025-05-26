import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

const Spinner = () => (
  <Flex align="center" gap="middle" className="spinner">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 54 }} spin />} />
  </Flex>
);

export default Spinner;
