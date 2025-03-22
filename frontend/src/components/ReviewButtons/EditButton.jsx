import React from "react";
import './EditButton.css'

function EditButton (props) {
    return (
        <button className="editButton" onClick={() => { props.onPressEdit(props.reviewData); }}>
            Edit</button>
    );
};

export default EditButton;