import React from "react";
import './ReviewCard.css'
import Stars from "../Stars/Stars";
import EditButton from "../ReviewButtons/EditButton";
import DeleteButton from "../ReviewButtons/DeleteButton";

function ReviewCard (props) {
    return (
        <div className="reviewCard" id={props.id}>
            <p className="title">{props.title}</p>
            <p className="body">{props.body}</p>
            <EditButton />
            <DeleteButton onPressDelete = {props.onDelete} reviewID = {props.id} />  
            <Stars className="stars" />
        </div>
    );
};

export default ReviewCard;