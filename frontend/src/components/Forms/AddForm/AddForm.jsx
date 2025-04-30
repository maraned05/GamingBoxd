import React, { useState } from "react";
import './AddForm.css'
import CloseButton from "../../CloseButton/CloseButton";
import InputStars from "../../Stars/InputStars";
import FormButton from "../FormButton";

function AddForm (props) {
    const [formData, setFormData] = useState({title: "", body: "", rating: "", date: "", media: null});
    const [errors, setErrors] = useState({title: "", body: "", rating: "", date: ""});

    function changeHandler (event) {
        const { name, value } = event.target; 
        if (name === 'media') {
            setFormData({...formData, [name]: event.target.files[0]});
        }
        else {
            setFormData({...formData, [name]: value});
            setErrors({...errors, [name]: ""});
        }
    }

    function pressAddHandler () {
        let newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.body.trim()) newErrors.body = "Review Body is required.";
        if (!formData.rating) newErrors.rating = "Rating is required.";
        if (!formData.date.trim()) newErrors.date = "Date is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }
        else {
            props.setIsAddOpen(false);
            props.onPressAddReviewButton(formData);
        }
    };

    
    return (
        <div className="addFormWindow">
            <div className="addFormHeader">
                <h1>Add a review</h1>
                <CloseButton setIsOpen = {props.setIsAddOpen}/>
            </div>
            <div className="addFormBody">
                <div className="inputTitle">
                    <label>Game's Title:</label>
                    <input type="text" name="title" autoComplete="off" placeholder="Game's Title"
                        value={formData.title} onChange={changeHandler}/>
                    {errors.title && <span style={{ color: "red", fontSize: "15px"}}>{errors.title}</span>}
                </div>
                
                <div className="inputReview">
                    <label>Review Body:</label>
                    <textarea name="body" autoComplete="off" placeholder="Write your review"
                        value={formData.body} onChange={changeHandler}/>
                    {errors.body && <span style={{ color: "red", fontSize: "15px" }}>{errors.body}</span>}
                </div>

                <div className="inputRating">
                    <label>Rating:</label>
                    <InputStars name = "rating" onChange = {changeHandler} className="inputStars"/>
                    {errors.rating && <span style={{ color: "red", fontSize: "15px" }}>{errors.rating}</span>}
                </div>

                <div className="inputDate">
                    <label>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange = {changeHandler} ></input>
                    {errors.date && <span style={{ color: "red", fontSize: "15px" }}>{errors.date}</span>}
                </div>

                <div className="inputMedia">
                    <label>Upload Media:</label>
                    <input type="file" accept="video/*,image/*" name="media" onChange = {changeHandler} ></input>
                </div>

                <FormButton onPressAdd={pressAddHandler} buttonText = 'Add'
                    title = {formData.title} body = {formData.body} />
            </div>
        </div>
    );
};

export default AddForm;