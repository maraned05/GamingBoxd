import React from "react";

import './SearchBar.css'

function SearchBarDate ( props ) {
    return (
        <div className="InputContainer">
            <input placeholder="Search by Date..." id="input" className="input" name="text" type="text" onChange={props.onChange} />
        </div>
    );
}

export default SearchBarDate;