import React from "react";
import './Inputstars.css'

function Inputstars (props) {
    return (
    <div className="ratingInput">
        <input type="radio" id="inputstar5" name="rating" value="5" onChange={props.onChange} />
        <label htmlFor="inputstar5"></label>
        <input type="radio" id="inputstar4" name="rating" value="4" onChange={props.onChange} />
        <label htmlFor="inputstar4"></label>
        <input type="radio" id="inputstar3" name="rating" value="3" onChange={props.onChange} />
        <label htmlFor="inputstar3"></label>
        <input type="radio" id="inputstar2" name="rating" value="2" onChange={props.onChange} />
        <label htmlFor="inputstar2"></label>
        <input type="radio" id="inputstar1" name="rating" value="1" onChange={props.onChange} />
        <label htmlFor="inputstar1"></label>
    </div>
    );
};

export default Inputstars;