import React, { useState } from "react";

import './MainPage.css'
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterButton from "../components/FilterButton/FilterButton";
import AddButton from "../components/AddButton/AddButton";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import AddForm from "../components/AddForm/AddForm"

function MainPage () {
    const [reviews, setReviews] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    function pressAddReviewButtonHandler (reviewTitle, reviewBody) {
        const newReview = {
            title: reviewTitle,
            body: reviewBody,
            id: crypto.randomUUID()
        };

        setReviews(prevReviews => {
            return prevReviews.concat(newReview);
        });
    }

    function DeleteHandler (reviewID) {
        setReviews(prevReviews => {
            return prevReviews.filter(r => r.id !== reviewID);
        });
    }

    return (
        <div>
            <Header />
            <div className="mainBody">
                <div className="controlsBar">
                    <SearchBar />
                    <FilterButton />
                    <AddButton setIsOpen = {setIsOpen}/>
                </div>
                <div className="reviewsGrid">
                    {
                        reviews.map(r => (<ReviewCard title = {r.title} body = {r.body} id = {r.id} onDelete = {DeleteHandler} />))
                    }
                </div>
            </div>

            { isOpen &&
                (<AddForm setIsOpen = {setIsOpen} onPressAddReviewButton = {pressAddReviewButtonHandler} />)
            }
        </div>
    );
}

export default MainPage;