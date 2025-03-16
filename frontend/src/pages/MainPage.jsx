import React from "react";

import './MainPage.css'
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterButton from "../components/FilterButton/FilterButton";
import AddButton from "../components/AddButton/AddButton";
import ReviewCard from "../components/ReviewCard/ReviewCard";

function MainPage () {
    return (
        <div>
            <Header />
            <div className="mainBody">
                <div className="controlsBar">
                    <SearchBar />
                    <FilterButton />
                    <AddButton />
                </div>
                <div className="reviewsGrid">
                    <ReviewCard className="card1"/>
                    <ReviewCard className="card2"/>
                    <ReviewCard className="card3"/>
                    <ReviewCard className="card4"/>
                    <ReviewCard className="card5"/>
                    <ReviewCard className="card6"/>
                    <ReviewCard className="card7"/>
                    <ReviewCard className="card8"/>
                </div>
            </div>
        </div>
    );
}

export default MainPage;