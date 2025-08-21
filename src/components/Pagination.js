import React from "react";
import "./../assets/pagination.scss";

function Pagination({
  page,
  totalPages,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
  handleDownload,
  convertTimeToReadable,
}) {
  return (
    <div className="pagination__line">
      <div className="page-size-selector">
        <label htmlFor="page-size-select">Items per page:</label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div class="paging">
      {page > 1 && (
<i onClick={() => handlePageChange("prev")} class="las la-arrow-circle-left"></i>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
<i onClick={() => handlePageChange("next")} class="las la-arrow-circle-right"></i>
      )}
      </div>
    </div>
  );
}

export default Pagination;
