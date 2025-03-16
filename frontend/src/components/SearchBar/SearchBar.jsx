import React from "react";

import './SearchBar.css'

function SearchBar () {
    return (
        <div className="InputContainer">
            <input placeholder="Search..." id="input" className="input" name="text" type="text" />
        </div>
    );
}

export default SearchBar;