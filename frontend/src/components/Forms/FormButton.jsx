import React from "react";

import './FormButton.css'

// () => {props.setIsOpen(false); props.onPressAdd(); }
// disabled = {!props.title || !props.body}

function FormButton (props) {

    // function clickedAddHandler (e) {
    //     e.preventDefault();
    //     props.setIsOpen(false); 
    //     props.onPressAdd();
    // }

    return (
        <button className="addButton" onClick={(e) => {e.preventDefault(); props.onPressAdd();}} >
            {props.buttonText}
        </button>
    );
};

export default FormButton;