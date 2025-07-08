import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

const PaginationBar = ({ pageCount, pageChange }) => (
  <nav aria-label="Page navigation" className="mt-4">
    <ReactPaginate
      containerClassName="pagination justify-content-center"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      activeClassName="active"
      onPageChange={pageChange}
      pageRangeDisplayed={4}
      pageCount={pageCount}
      previousLabel="<"
      breakLabel="..."
      nextLabel=">"
      renderOnZeroPageCount={null}
    />
  </nav>
);
export default PaginationBar;

PaginationBar.propTypes = {
  pageCount: PropTypes.number.isRequired,
  pageChange: PropTypes.func.isRequired,
};
