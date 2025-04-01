import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage'; 

import './App.css';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  const [loadedReviews, setLoadedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lowestRating, setLowestRating] = useState(null);
  const [highestRating, setHighestRating] = useState(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    const response = await fetch('http://localhost:5000/reviews');

    const responseData = await response.json();

    setLoadedReviews(responseData.reviews);
    setIsLoading(false);
  };

  const fetchHighestRating = async () => {
    const response = await fetch('http://localhost:5000/reviews/highestRating');
    const responseData = await response.json();
    console.log(responseData.highestRating);
    console.log(typeof responseData.highestRating);
    setHighestRating(responseData.highestRating);
  };

  const fetchLowestRating = async () => {
    const response = await fetch('http://localhost:5000/reviews/lowestRating');
    const responseData = await response.json();
    console.log(responseData.lowestRating);
    setLowestRating(responseData.lowestRating);
  };

  useEffect(() => {
      fetchReviews();
  }, []);

  const addReviewHandler = async (reviewTitle, reviewBody, reviewRating, reviewDate) => {
      try {
        const newProduct = {
          title: reviewTitle,
          body: reviewBody,
          rating: reviewRating,
          date: reviewDate
        };
        let hasError = false;
        const response = await fetch('http://localhost:5000/review', {
          method: 'POST',
          body: JSON.stringify(newProduct),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          hasError = true;
        }

        const responseData = await response.json();

        if (hasError) {
          throw new Error(responseData.message);
        }

        setLoadedReviews(prevProducts => {
          return prevProducts.concat({
            ...newProduct,
            id: responseData.review.id
          });
        });

        fetchHighestRating();
        fetchLowestRating();

      } catch (error) {
        alert(error.message || 'Something went wrong!');
      }
  };

  const editReviewHandler = async (reviewData) => {
      try {
        let hasError = false;
        const response = await fetch(`http://localhost:5000/review/${reviewData.id}`, {
          method: 'PUT',
          body: JSON.stringify(reviewData),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          hasError = true;
        }

        const responseData = await response.json();

        if (hasError) {
          throw new Error(responseData.message);
        }
        

        setLoadedReviews(prevReviews => {
          return prevReviews.map((review) => review.id === responseData.review.id ? 
          {title: responseData.review.title, body: responseData.review.body, rating: responseData.review.rating, 
          date: responseData.review.date, id: responseData.review.id} : review );
        });

        fetchHighestRating();
        fetchLowestRating();

      }
      catch (error) {
          alert(error.message || 'Something went wrong!');
      }
  };

  const deleteReviewHandler = async (reviewID) => {
    try {
      let hasError = false;
      const response = await fetch(`http://localhost:5000/review/${reviewID}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        hasError = true;
      }

      const responseData = await response.json();

      if (hasError) {
        throw new Error(responseData.message);
      }

      setLoadedReviews(prevReviews => {
        return prevReviews.filter(r => r.id !== responseData.reviewID);
      });

      fetchHighestRating();
      fetchLowestRating();
      
    }
    catch (error) {
        alert(error.message || 'Something went wrong!');
    }
  }; 

  const sortingHandler = async (isSorted) => {
      setIsLoading(true);
      if (isSorted) {
        const response = await fetch('http://localhost:5000/sortedReviews');
        const responseData = await response.json();
        setLoadedReviews(responseData.sortedReviews);
      } 
      else {
        fetchReviews();
      } 
      setIsLoading(false);
  }; 

  const filteringHandler = async (textQuery) => {
    if (textQuery.trim() === "")
        fetchReviews();
    else {
      const response = await fetch(`http://localhost:5000/filteredReviews/${textQuery}`);
      const responseData = await response.json();
      setLoadedReviews(responseData.filteredReviews);
    }
  };

  const dateFilteringHandler = async (textQuery) => {
    if (textQuery.trim() === "")
        fetchReviews();
    else {
      const response = await fetch(`http://localhost:5000/filteredByDateReviews/${textQuery}`);
      const responseData = await response.json();
      setLoadedReviews(responseData.filteredReviews);
    }
  };


  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {isLoading ? <MainPage reviewsList = {[]}/> : 
              <MainPage onAddReview = {addReviewHandler} onEditReview = {editReviewHandler}
              onDeleteReview = {deleteReviewHandler} onSorting = {sortingHandler} onFiltering = {filteringHandler}  onDateFiltering = {dateFilteringHandler}
              reviewsList = {loadedReviews} highestRating = {highestRating} lowestRating = {lowestRating} />} 
          />
          <Route path='/statistics' element = {<StatisticsPage  />}/>
        </Routes>
      </BrowserRouter>
    );
}

export default App;
