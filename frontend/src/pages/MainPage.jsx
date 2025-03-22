import React, { useState } from "react";

import './MainPage.css'
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterButton from "../components/FilterButton/FilterButton";
import AddButton from "../components/AddButton/AddButton";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import AddForm from "../components/AddForm/AddForm"
import EditForm from "../components/EditForm/EditForm"

function MainPage () {
    const [reviews, setReviews] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [editFormContent, setEditFormContent] = useState();
    const [shownReviews, setShownReviews] = useState([]);

    function pressAddReviewButtonHandler (reviewTitle, reviewBody, starsRating) {
        const newReview = {
            title: reviewTitle,
            body: reviewBody,
            rating: starsRating,
            id: crypto.randomUUID()
        };

        setReviews(prevReviews => {
            const updatedReviews = [...prevReviews, newReview];
            setShownReviews(updatedReviews);
            return updatedReviews;
        });
    }

    function pressEditReviewButtonHandler (newReviewData) {
        setReviews((prevReviews) => {
            const updatedReviews = prevReviews.map((review) => review.id === newReviewData.id ? 
            {title: newReviewData.title, body: newReviewData.body, rating: newReviewData.rating, id: newReviewData.id} : review )
            setShownReviews(updatedReviews);
            return updatedReviews;
            }
        );
    }

    function editHandler (reviewData) {
        setIsEditOpen(true);
        setEditFormContent(<EditForm setIsEditOpen = {setIsEditOpen} reviewData = {reviewData} 
            onPressEditReviewButton = {pressEditReviewButtonHandler} />)
    }

    function searchHandler (event) {
        const query = event.target.value;
        
        if (query.trim() === "")
            setShownReviews(reviews);

        else setShownReviews(reviews.filter((review) => review.title.toLowerCase().includes(query)));
    }

    function sortingHandler() {
        setIsSorted((prevValue) => {
            const newValue = !prevValue;
            if (newValue) {
                const updatedReviews = [...reviews].sort(function (r1, r2) {return r1.rating - r2.rating; });
                setShownReviews(updatedReviews);
            }
            else setShownReviews(reviews);
            return newValue;
        }
        );
    }

    function deleteHandler (reviewID) {
        setReviews(prevReviews => {
            const updatedReviews = prevReviews.filter(r => r.id !== reviewID);
            setShownReviews(updatedReviews);
            console.log(reviews);
            return updatedReviews;
        });
    }

    return (
        <div>
            <Header />
            <div className="mainBody">
                <div className="controlsBar">
                    <SearchBar onChange = {searchHandler}/>
                    <FilterButton onChange = {sortingHandler}/>
                    <AddButton setIsOpen = {setIsAddOpen}/>
                </div>
                <div className="reviewsGrid">  
                    {
                        shownReviews.map(r => (<ReviewCard key = {r.id} review = {r} 
                            onDelete = {deleteHandler} onEdit = {editHandler} />))
                    }
                </div>
            </div>

            { isAddOpen &&
                (<AddForm setIsAddOpen = {setIsAddOpen} onPressAddReviewButton = {pressAddReviewButtonHandler} />)
            }

            {   isEditOpen &&
                editFormContent
            }
        </div>
    );
}

export default MainPage;