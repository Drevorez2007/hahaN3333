import React from "react";
import { Pagination } from "antd";

const PaginationPage = ({ totalPage, currentPage, onChangePage }) => (
  <Pagination
    style={{ paddingTop: 10 }}
    align="center"
    defaultCurrent={1}
    current={currentPage}
    total={totalPage * 20}
    pageSize={20}
    showLessItems={true}
    showSizeChanger={false}
    onChange={onChangePage}
  />
);

export default PaginationPage;
