import React from 'react';

import './FilterButton.css';

function FilterButton (props) {
  return (
    <button className="filter-btn" onClick={props.onChange}>
      <span className="bar bar1"></span>
      <span className="bar bar2"></span>
      <span className="bar bar1"></span>
    </button>
  );
};

export default FilterButton;
