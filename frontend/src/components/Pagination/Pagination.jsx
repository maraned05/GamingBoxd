import React, { useState } from "react";
import "./Pagination.css"

function Pagination ({reviewsPerPage, totalReviews, paginate}) {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalReviews / reviewsPerPage); i++)
        pageNumbers.push(i);

    const [activePage, setActivePage] = useState(1);

    function handlePageClick (number) {
        setActivePage(number);
    }

    return (
        <div>
            <nav>
                <ul className="pagination">
                    {pageNumbers.map((number) => (
                        <li key = {number} onClick={() => {handlePageClick(number); paginate(number); }}
                            className={`page-item ${activePage === number ? "active" : ""}`} >
                            <a className="page-link">
                                {number}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;