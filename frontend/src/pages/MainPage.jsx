import React, { useEffect, useState, useRef } from "react";

import './MainPage.css'
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterButton from "../components/FilterButton/FilterButton";
import AddReviewButton from "../components/ControlsButtons/AddReviewButton";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import AddForm from "../components/Forms/AddForm/AddForm"
import EditForm from "../components/Forms/EditForm/EditForm"
//import Pagination from "../components/Pagination/Pagination";
import OpenStatisticsButton from "../components/ControlsButtons/OpenStatisticsButton";
import SearchBarDate from "../components/SearchBar/SearchBarDate";
import { useConnectivityStatus } from '../hooks/useConnectivityStatus';
import { BACKEND_URL } from '../config';

function MainPage (props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [editFormContent, setEditFormContent] = useState();
    const {isOnline, backendStatus} = useConnectivityStatus(BACKEND_URL);

    //Scroll
    const reviewsGridRef = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            const grid = reviewsGridRef.current;
            if (!grid) return;

            if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 50) {
                props.onLoadMore(); // Trigger loading more reviews
            }
        };

        const grid = reviewsGridRef.current;
        grid?.addEventListener("scroll", handleScroll);

        return () => grid?.removeEventListener("scroll", handleScroll);
    }, [props]);

    // Pagination
    // const [currentPage, setCurrentPage] = useState(1);
    // const reviewsPerPage = 8;
    // const indexOfLastReview = currentPage * reviewsPerPage;
    // const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    // const currentReviews = props.reviewsList.slice(indexOfFirstReview, indexOfLastReview);

    function paginate (pageNumber) {
        setCurrentPage(pageNumber);
    }

    function pressAddReviewButtonHandler (reviewData) {
        props.onAddReview(reviewData);
    }

    function pressEditReviewButtonHandler (newReviewData) {
        console.log(newReviewData.id);
        props.onEditReview(newReviewData);
    }

    function openEditFormHandler (reviewData) {
        console.log(reviewData.id);
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

    function openReviewMediaHandler (reviewID) {
        const index = props.reviewsList.findIndex(review => review.id === reviewID);
        const mediaWindow = window.open(`/reviewMedia/${reviewID}`, "_blank");
        //console.log(props.reviewsList[index].media);
        mediaWindow["mediaName"] = props.reviewsList[index].media;
    }

    function openStatisticsPage () {
        window.open("/statistics", "_blank");
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
                <div className="reviewsGrid" ref={reviewsGridRef}>  
                    {
                        props.reviewsList.map((r) => (
                            <ReviewCard key = {r.id}
                                review = {r} 
                                onDelete = {deleteReviewHandler} 
                                onEdit = {openEditFormHandler} 
                                onMedia = {openReviewMediaHandler}
                                rank = {(r.rating == props.highestRating) ? "highest" : 
                                    (r.rating == props.lowestRating) ? "lowest" : "average"} 
                            />
                        ))
                    }
                </div>
                {/* <Pagination reviewsPerPage = {reviewsPerPage} totalReviews = {props.reviewsList.length} paginate = {paginate} /> */}
            </div>

            { isAddOpen &&
                (<AddForm setIsAddOpen = {setIsAddOpen} onPressAddReviewButton = {pressAddReviewButtonHandler} />)
            }

            {   isEditOpen &&
                editFormContent
            }

            {
                !isOnline && <div className="connectionStatus">🚫 Network disconnected</div>
            }

            {
                isOnline && backendStatus === 'down' && <div className="connectionStatus">⚠️ Cannot reach backend server</div>
            }

            {
                isOnline && backendStatus === 'ok' && <div className="connectionStatus">✅ Connected</div>
            }

        </div>
    );
}

export default MainPage;