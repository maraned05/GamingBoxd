import React from "react";
import './DeleteButton.css'

function DeleteButton (props) {
    return (
        <button className="deleteButton" onClick={() => { props.onPressDelete(props.reviewID); }}>
            Delete</button>
    );
};

export default DeleteButton;