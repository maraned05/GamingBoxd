import React, { useEffect, useState } from "react";

import './MainPage.css'
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterButton from "../components/FilterButton/FilterButton";
import AddReviewButton from "../components/ControlsButtons/AddReviewButton";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import AddForm from "../components/Forms/AddForm/AddForm"
import EditForm from "../components/Forms/EditForm/EditForm"
import Pagination from "../components/Pagination/Pagination";
import OpenStatisticsButton from "../components/ControlsButtons/OpenStatisticsButton";
import SearchBarDate from "../components/SearchBar/SearchBarDate";

function MainPage (props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [editFormContent, setEditFormContent] = useState();
    const [statisticsTab, setStatisticsTab] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 8;
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = props.reviewsList.slice(indexOfFirstReview, indexOfLastReview);

    function paginate (pageNumber) {
        setCurrentPage(pageNumber);
    }


    function pressAddReviewButtonHandler (reviewTitle, reviewBody, reviewRating, reviewDate) {
        props.onAddReview(reviewTitle, reviewBody, reviewRating, reviewDate);
    }

    function pressEditReviewButtonHandler (newReviewData) {
        props.onEditReview(newReviewData);
    }

    function openEditFormHandler (reviewData) {
        setIsEditOpen(true);
        setEditFormContent(<EditForm setIsEditOpen = {setIsEditOpen} reviewData = {reviewData} 
            onPressEditReviewButton = {pressEditReviewButtonHandler} />)
    }

    function searchHandler (event) {
        props.onFiltering(event.target.value);
    }

    function searchDateHandler (event) {
        props.onDateFiltering(event.target.value);
    }

    function sortingHandler() {
        setIsSorted(prevValue => {return !prevValue;});
        props.onSorting(isSorted);
    }

    function deleteReviewHandler (reviewID) {
        props.onDeleteReview(reviewID);
    }

    function openStatisticsPage () {
        const newTab = window.open("/statistics", "_blank");
        setStatisticsTab(newTab);
    }

    return (
        <div>
            <Header />
            <div className="mainBody">
                <div className="controlsBar">
                    <div className="leftControls">
                        <SearchBar onChange = {searchHandler}/>
                        <SearchBarDate onChange = {searchDateHandler}/>
                        <FilterButton onChange = {sortingHandler}/>
                    </div>
                    <div className="rightControls">
                        <OpenStatisticsButton onClick = {openStatisticsPage}/>
                        <AddReviewButton setIsOpen = {setIsAddOpen}/>
                    </div>
                </div>
                <div className="reviewsGrid">  
                    {
                        currentReviews.map((r) => (
                            <ReviewCard key = {r.id} review = {r} 
                            onDelete = {deleteReviewHandler} onEdit = {openEditFormHandler} 
                            rank = {(r.rating == props.highestRating) ? "highest" : 
                                    (r.rating == props.lowestRating) ? "lowest" 
                                    : "average"} />
                        ))
                    }
                </div>
                <Pagination reviewsPerPage = {reviewsPerPage} totalReviews = {props.reviewsList.length} paginate = {paginate} />
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