import React, { useEffect, useState } from "react";
import './StatisticsPage.css';
import { PieChart, Pie, Cell, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Legend } from 'recharts'
import io from 'socket.io-client';
import { BACKEND_URL } from "../config";

function StatisticsPage () {
    const [reviews, setReviews] = useState(null);
    const [ratingsData, setRatingsData] = useState(null);
    const [monthlyReviews, setMonthlyReviews] = useState(null);
    const [monthlyRatings, setMonthlyRatings] = useState(null);
    const COLORS = ["#F90F0F", "#F97D0F", "#F9C00F", "#98E509", "#4CE509"];
    const socket = io(BACKEND_URL);

    useEffect(() => {
        socket.on('reviews:init', (initialReviews) => {
            setReviews(initialReviews);
        });

        socket.on('review:new', (newReview) => {
            setReviews(prev => [...prev, newReview]);
        });

        socket.on('review:updated', (updatedReview) => {
            setReviews(prev => { 
                return prev.map((r) => r.id === updatedReview.id ? 
                {title: updatedReview.title, body: updatedReview.body, rating: updatedReview.rating, date: updatedReview.date, id: updatedReview.id}
                : r)
            })
        });

        socket.on('review:deleted', (reviewID) => {
            setReviews(prev => {return prev.filter(r => r.id !== reviewID)});
        });

        return () => {
            socket.off('reviews:init');
            socket.off('review:new');
            socket.off('review:updated');
            socket.off('review:deleted');
        };
    });

    useEffect(() => {
        if (reviews !== null) {
            setRatingsData(getRatingStats(reviews));
            setMonthlyReviews(getReviewsPerMonthStats(reviews));
            setMonthlyRatings(getRatingsPerMonthStats(reviews));
        }
    }, [reviews]);

    const getRatingStats = (r) => {
        const ratingCounts = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

        r.forEach(({ rating }) => {
            if (ratingCounts[rating] !== undefined) {
              ratingCounts[rating]++;
            }
        });

        return Object.entries(ratingCounts).filter(([, count]) => count > 0).map(([rating, count]) => ({
            rating: `${rating} Stars`,
            count
            }
        ));
    };

    const getReviewsPerMonthStats = (r) => {
        const monthlyCounts = Array(12).fill(0);

        r.forEach(({ date }) => {
            const reviewDate = new Date(date);
            if (reviewDate.getFullYear() === 2025) {
              const monthIndex = reviewDate.getMonth();
              monthlyCounts[monthIndex] += 1;
            }
          });

        return Object.entries(monthlyCounts).map((count, index) => ({
            month: new Date(2025, index, 1).toLocaleString("default", { month: "short" }),
            count: count[1]
          }));
    }

    const getRatingsPerMonthStats = (r) => {
        const monthlyMap = new Map();
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        r.forEach(({ date, rating }) => {
            const month = new Date(date).toLocaleString("default", { month: "short" });
        
            if (!monthlyMap.has(month)) {
              monthlyMap.set(month, { month, highest: rating, lowest: rating });
            } else {
              monthlyMap.get(month).highest = Math.max(monthlyMap.get(month).highest, rating);
              monthlyMap.get(month).lowest = Math.min(monthlyMap.get(month).lowest, rating);
            }
          });

          return Array.from(monthlyMap.values()).sort(
            (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
          );
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
                    ratingsData !== null && reviews.length !== 0 && monthlyReviews !== null &&
                    <div className="chartsContainer">
                        <div className="pieChart">
                            <PieChart width={600} height={400}>
                                <Pie data={ratingsData} dataKey="count" nameKey="rating" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
                                        {   
                                            ratingsData.map((_, index) => (
                                                // <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length ]} />
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))
                                        }
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>

                        <div className="areaChart">
                            <AreaChart width={600} height={400} data={monthlyReviews} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month"/>
                                <YAxis domain={[0, 10]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }allowDecimals={false}/>
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </div>

                        <div className="barChart">
                            <BarChart data={monthlyRatings} width={600} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[0, 5]} tickCount={6} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="highest" fill="#4CAF50" name="Highest Rating" />
                                <Bar dataKey="lowest" fill="#F44336" name="Lowest Rating" />
                            </BarChart>
                        </div>
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