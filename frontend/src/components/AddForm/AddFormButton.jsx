import React from "react";

import './AddFormButton.css'

// () => {props.setIsOpen(false); props.onPressAdd(); }
// disabled = {!props.title || !props.body}

function AddFormButton (props) {

    // function clickedAddHandler (e) {
    //     e.preventDefault();
    //     props.setIsOpen(false); 
    //     props.onPressAdd();
    // }

    return (
        <button className="addButton" onClick={(e) => {e.preventDefault(); props.onPressAdd();}} >
            Add
        </button>
    );
};

export default AddFormButton;