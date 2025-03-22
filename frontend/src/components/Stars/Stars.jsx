import React from "react";
import './Stars.css'

function Stars ({value, reviewID}) {
    return (
    <div className="ratingStars">
        <input type="radio" id={`star5-${reviewID}`} name={`rating-${reviewID}`} value="5" checked={value === "5"} readOnly/>
        <label htmlFor={`star5-${reviewID}`}></label>
        <input type="radio" id={`star4-${reviewID}`} name={`rating-${reviewID}`} value="4" checked={value=== "4"} readOnly/>
        <label htmlFor={`star4-${reviewID}`}></label>
        <input type="radio" id={`star3-${reviewID}`} name={`rating-${reviewID}`} value="3" checked={value === "3"} readOnly/>
        <label htmlFor={`star3-${reviewID}`}></label>
        <input type="radio" id={`star2-${reviewID}`} name={`rating-${reviewID}`} value="2" checked={value === "2"} readOnly/>
        <label htmlFor={`star2-${reviewID}`}></label>
        <input type="radio" id={`star1-${reviewID}`} name={`rating-${reviewID}`} value="1" checked={value === "1"} readOnly/>
        <label htmlFor={`star1-${reviewID}`}></label>
    </div>
    );
};

export default Stars;