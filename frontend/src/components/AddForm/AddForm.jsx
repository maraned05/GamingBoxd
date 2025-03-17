import React, { useState } from "react";
import './AddForm.css'
import CloseButton from "../CloseButton/CloseButton";
import InputStars from "../Stars/InputStars";
import AddFormButton from "../AddButton/AddFormButton";

function AddForm (props) {
    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredBody, setEnteredBody] = useState('');

    function titleChangeHandler (event) {
        setEnteredTitle(event.target.value);
    }

    function bodyChangeHandler (event) {
        setEnteredBody(event.target.value);
    }

    function pressAddHandler () {
        props.onPressAddReviewButton(enteredTitle, enteredBody);
    };

    
    return (
        <div className="formWindow">
            <div className="formHeader">
                <h1>Add a review</h1>
            </div>
            <CloseButton setIsOpen = {props.setIsOpen}/>
            <div className="formBody">
                <div className="inputTitle">
                    <label>Game's Title:</label>
                    <input type="text" required="" autocomplete="off" placeholder="Game's Title"
                        value={enteredTitle} onChange={titleChangeHandler}/>
                </div>
                
                <div className="inputReview">
                    <label for="review">Review Body:</label>
                    {/* i could use textarea here */}
                    <input type="text" required="" autocomplete="off" placeholder="Write your review"
                        value={enteredBody} onChange={bodyChangeHandler}/>
                </div>

                <div className="inputRating">
                    <label for="rating">Rating:</label>
                    <InputStars className="inputStars"/>
                </div>

                <AddFormButton setIsOpen={props.setIsOpen} onPressAdd={pressAddHandler} 
                    title = {enteredTitle} body = {enteredBody} />
            </div>
        </div>
    );
};

export default AddForm;