import React, { useEffect, useState } from "react";

import './MainPage.css'
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterButton from "../components/FilterButton/FilterButton";
import AddReviewButton from "../components/ControlsButtons/AddReviewButton";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import AddForm from "../components/AddForm/AddForm"
import EditForm from "../components/EditForm/EditForm"
import Pagination from "../components/Pagination/Pagination";
import OpenStatisticsButton from "../components/ControlsButtons/OpenStatisticsButton";

function MainPage () {
    const [reviews, setReviews] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [editFormContent, setEditFormContent] = useState();
    const [shownReviews, setShownReviews] = useState([]);
    const [lowestRating, setLowestRating] = useState(null);
    const [highestRating, setHighestRating] = useState(null);
    const [statisticsTab, setStatisticsTab] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 8;
    // const [indexOfLastReview, setIndexOfLastReview] = useState(8);
    // const [indexOfFirstReview, setIndexOfFirstReview] = useState(0);
    // const [currentReviews, setCurrentReviews] = useState(shownReviews.slice(indexOfFirstReview, indexOfLastReview));

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = shownReviews.slice(indexOfFirstReview, indexOfLastReview);

    function paginate (pageNumber) {
        setCurrentPage(pageNumber);
    }

    function pressAddReviewButtonHandler (reviewTitle, reviewBody, starsRating) {
        const newReview = {
            title: reviewTitle,
            body: reviewBody,
            rating: starsRating,
            id: crypto.randomUUID()
        };

        if (highestRating === null && lowestRating === null) {
            setLowestRating(starsRating);
            setHighestRating(starsRating);
        }
        else {
            if (starsRating < lowestRating) 
                setLowestRating(starsRating);
    
            if (starsRating > highestRating) 
                setHighestRating(starsRating);
        }

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

    function openStatisticsPage () {
        const newTab = window.open("/statistics", "_blank");
        setStatisticsTab(newTab);

        setTimeout(() => {
            newTab.postMessage(reviews, "*");
        }, 1000);

        // const sendMessage = (event) => {
        //     if (event.data.status === "ready") {
        //       newTab.postMessage(reviews, window.location.origin);
        //       window.removeEventListener("message", sendMessage); // Clean up
        // }
    }

    useEffect(() => {
        if (statisticsTab)
            statisticsTab.postMessage(reviews, "*");
    }, [reviews]);

    return (
        <div>
            <Header />
            <div className="mainBody">
                <div className="controlsBar">
                    <div className="leftControls">
                        <SearchBar onChange = {searchHandler}/>
                        <FilterButton onChange = {sortingHandler}/>
                    </div>
                    <div className="rightControls">
                        <OpenStatisticsButton onClick = {openStatisticsPage}/>
                        <AddReviewButton setIsOpen = {setIsAddOpen}/>
                    </div>
                </div>
                <div className="reviewsGrid">  
                    {
                        // shownReviews.map((r) => ( r.rating === highestRating ?
                        //     <ReviewCard key = {r.id} review = {r} 
                        //     onDelete = {deleteHandler} onEdit = {editHandler} rank = "highest" />
                        //     :
                        //     r.rating === lowestRating ?
                        //     <ReviewCard key = {r.id} review = {r} 
                        //     onDelete = {deleteHandler} onEdit = {editHandler} rank = "lowest"/>
                        //     :
                        //     <ReviewCard key = {r.id} review = {r} 
                        //     onDelete = {deleteHandler} onEdit = {editHandler} rank = "average" />
                        // ))

                        currentReviews.map((r) => (
                            <ReviewCard key = {r.id} review = {r} 
                            onDelete = {deleteHandler} onEdit = {editHandler} 
                            rank = {(r.rating === highestRating && reviews.length > 1) ? "highest" : 
                                    (r.rating === lowestRating && reviews.length > 1) ? "lowest" 
                                    : "average"} />
                        ))
                    }
                </div>
                <Pagination reviewsPerPage = {reviewsPerPage} totalReviews = {shownReviews.length} paginate = {paginate} />
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