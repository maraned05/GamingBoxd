import React from "react";
import './OpenStatisticsButton.css'

function OpenStatisticsButton ( {onClick} ) {
    return (
        <button className="openStatisticsButton" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
            <div className="text">Statistics</div>
        </button>
    );
};

export default OpenStatisticsButton;