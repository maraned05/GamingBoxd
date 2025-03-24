import React from "react";
import './ReviewCard.css'
import Stars from "../Stars/Stars";
import EditButton from "../ReviewButtons/EditButton";
import DeleteButton from "../ReviewButtons/DeleteButton";

function ReviewCard (props) {
    return (
        <div className = {props.rank === "highest" ? "reviewCard highRating" : props.rank === "lowest" ? "reviewCard lowRating" : "reviewCard averageRating"}>
            <p className="dateAdded">{`Date added: ${props.review.date}`}</p>
            <p className="title">{props.review.title}</p>
            <p className="body">{props.review.body}</p>
            <EditButton onPressEdit = {props.onEdit} reviewData = {props.review} />
            <DeleteButton onPressDelete = {props.onDelete} reviewID = {props.review.id} />  
            <Stars value = {props.review.rating} reviewID = {props.review.id} className="stars" />
        </div>
    );
};

export default ReviewCard;