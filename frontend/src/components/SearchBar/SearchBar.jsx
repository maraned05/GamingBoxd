import React from "react";

import './SearchBar.css'

function SearchBar ( props ) {
    return (
        <div className="InputContainer">
            <input placeholder="Search..." id="input" className="input" name="text" type="text" onChange={props.onChange} />
        </div>
    );
}

export default SearchBar;