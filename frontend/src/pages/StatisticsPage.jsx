import React, { useEffect, useState } from "react";
import './StatisticsPage.css';
import { PieChart, Pie, Cell } from 'recharts'

function StatisticsPage () {
    const [reviews, setReviews] = useState(null);
    const [ratingsData, setRatingsData] = useState(null);
    const COLORS = ["#FF5733", "#FF8D1A", "#FFC300", "#33FF57", "#3385FF"];

    useEffect(() => {
        const receiveMessage = (event) => {
            if (event.origin !== window.location.origin) 
                return;
            console.log(event.data);
            setReviews(event.data);
            console.log(reviews);
        };

        window.addEventListener("message", receiveMessage);
        return () => window.removeEventListener("message", receiveMessage);
    });

    useEffect(() => {
        if (reviews !== null) {
            setRatingsData(getRatingStats(reviews));
        }
    }, [reviews]);

    const getRatingStats = (r) => {
        const ratingCounts = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

        r.forEach(({ rating }) => {
            if (ratingCounts[rating] !== undefined) {
              ratingCounts[rating]++;
            }
        });

        return Object.entries(ratingCounts).map(([rating, count]) => ({
            rating: `${rating} Stars`,
            count
            }
        ));
    };

    return (
        <div className="statisticsPage">
            <div className="statisticsContainer">
                <h1>User's Reviews Statistics</h1>
                {
                    ratingsData === null && 
                    <p>Loading...</p>
                }
                {
                    ratingsData !== null && reviews.length !== 0 &&
                    <div className="pieChart">
                        <PieChart width={600} height={600}>
                            <Pie data={ratingsData} dataKey="count" nameKey="rating" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
                                    {   
                                        ratingsData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))
                                    }
                            </Pie>
                        </PieChart>
                    </div>
                }
                {
                    ratingsData !== null && reviews.length === 0 &&
                    <p>No Reviews from this User.</p>
                }
            </div>
        </div>  
    );
};

export default StatisticsPage;