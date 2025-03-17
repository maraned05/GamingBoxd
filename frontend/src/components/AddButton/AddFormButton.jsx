import React from "react";

import './AddFormButton.css'

function AddFormButton (props) {
    return (
        <button className="addButton" onClick={() => {props.setIsOpen(false); props.onPressAdd(); }} 
            disabled = {!props.title || !props.body}>
            Add
        </button>
    );
};

export default AddFormButton;