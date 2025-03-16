import React from "react";
import './ReviewCard.css'
import Stars from "../Stars/Stars";
import EditButton from "../ReviewButtons/EditButton";
import DeleteButton from "../ReviewButtons/DeleteButton";

function ReviewCard () {
    return (
        <div className="reviewCard">
            <p className="title">Review Title</p>
            <p className="body">Review Body</p>
            <EditButton />
            <DeleteButton />  
            <Stars className="stars" />
        </div>
    );
};

export default ReviewCard;