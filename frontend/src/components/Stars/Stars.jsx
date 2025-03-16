import React from "react";
import './Stars.css'

function Stars () {
    return (
    <div className="rating">
        <input type="radio" id="star5" name="rating" value="5" />
        <label htmlFor="star5"></label>
        <input type="radio" id="star4" name="rating" value="4" />
        <label htmlFor="star4"></label>
        <input type="radio" id="star3" name="rating" value="3" />
        <label htmlFor="star3"></label>
        <input type="radio" id="star2" name="rating" value="2" />
        <label htmlFor="star2"></label>
        <input type="radio" id="star1" name="rating" value="1" />
        <label htmlFor="star1"></label>
    </div>
    );
};

export default Stars;