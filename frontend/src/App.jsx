import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage'; 
import './App.css';
import StatisticsPage from './pages/StatisticsPage';
import { useConnectivityStatus } from './hooks/useConnectivityStatus';
import { BACKEND_URL } from './config';
import ReviewMediaPage from './pages/ReviewMediaPage';
import { queueOperation, syncPendingOperations } from './syncOperations';
import {formDataToSerializable, objectToFormData} from './formdataSerialization';

function App() {
  const [loadedReviews, setLoadedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lowestRating, setLowestRating] = useState(null);
  const [highestRating, setHighestRating] = useState(null);

  //const {isOnline, backendStatus} = useConnectivityStatus(BACKEND_URL);
  
  // useEffect(() => {
  //   if (isOnline && backendStatus === 'ok')
  //     syncPendingOperations();
  //     fetchReviews();
  //     fetchHighestRating();
  //     fetchLowestRating();
  // }, [isOnline, backendStatus]);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPaginatedReviews = async (page) => {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/paginatedReviews?page=${page}&limit=8`);
      const responseData = await response.json();

      if (responseData.reviews.length === 0) {
          setHasMore(false); // No more reviews to fetch
      } else {
          //setLoadedReviews((prevReviews) => [...prevReviews, ...responseData.reviews]);
          setLoadedReviews((prevReviews) => {
            const newReviews = responseData.reviews.filter(
                (newReview) => !prevReviews.some((review) => review.id === newReview.id)
            );
            return [...prevReviews, ...newReviews];
        });
      }
      setIsLoading(false);
  };

  useEffect(() => {
      fetchPaginatedReviews(currentPage);
  }, [currentPage]);

  const loadMoreReviews = () => {
    if (hasMore && !isLoading) {
        setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const fetchReviews = async () => {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/reviews`);

      const responseData = await response.json();

      setLoadedReviews(responseData.reviews);
      setIsLoading(false);
  };

  const fetchHighestRating = async () => {
    const response = await fetch(`${BACKEND_URL}/reviews/highestRating`);
    const responseData = await response.json();
    setHighestRating(responseData.highestRating);
  };

  const fetchLowestRating = async () => {
    const response = await fetch(`${BACKEND_URL}/reviews/lowestRating`);
    const responseData = await response.json();
    setLowestRating(responseData.lowestRating);
  };

  useEffect(() => {
      fetchReviews();
      fetchHighestRating();
      fetchLowestRating();
  }, []);

const addReviewHandler = async (reviewData) => {
    let newProduct;
    try {
      newProduct = new FormData();
      newProduct.append("title", reviewData.title);
      newProduct.append("body", reviewData.body);
      newProduct.append("rating", reviewData.rating);
      newProduct.append("date", reviewData.date);
      if (reviewData.media) { 
        newProduct.append("media", reviewData.media);
      }
      let hasError = false;
      const response = await fetch(`${BACKEND_URL}/review`, {
        method: 'POST',
        body: newProduct
      });

      if (!response.ok) {
        // const serializablePayload = await formDataToSerializable(newProduct);
        // await queueOperation('create', serializablePayload);
        hasError = true;
      }
      const responseData = await response.json();

      if (hasError) {
        throw new Error(responseData.message);
      }

      setLoadedReviews(prevProducts => {
        return prevProducts.concat({
          title: newProduct.get("title"),
          body: newProduct.get("body"),
          rating: newProduct.get("rating"),
          date: newProduct.get("date"),
          media: responseData.review.media,
          id: responseData.review.id
        });
      });

      fetchHighestRating();
      fetchLowestRating();

    } catch (error) {
      // const serializablePayload = await formDataToSerializable(newProduct);
      // await queueOperation('create', serializablePayload);
      alert(error.message || 'Something went wrong!');
    }
};

  const editReviewHandler = async (reviewData) => {
      try {
        let hasError = false;
        const response = await fetch(`${BACKEND_URL}/review/${reviewData.id}`, {
          method: 'PUT',
          body: JSON.stringify(reviewData),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          //await queueOperation('update', reviewData);
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
      const response = await fetch(`${BACKEND_URL}/review/${reviewID}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        //await queueOperation('delete', reviewID);
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
        const response = await fetch(`${BACKEND_URL}/sortedReviews`);
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
      const response = await fetch(`${BACKEND_URL}/filteredReviews/${textQuery}`);
      const responseData = await response.json();
      setLoadedReviews(responseData.filteredReviews);
    }
  };

  const dateFilteringHandler = async (textQuery) => {
    if (textQuery.trim() === "")
        fetchReviews();
    else {
      const response = await fetch(`${BACKEND_URL}/filteredByDateReviews/${textQuery}`);
      const responseData = await response.json();
      setLoadedReviews(responseData.filteredReviews);
    }
  };


  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {
              isLoading ? <MainPage  reviewsList = {[]} /> 
              :
              <MainPage onAddReview = {addReviewHandler} 
              onEditReview = {editReviewHandler} 
              onDeleteReview = {deleteReviewHandler} 
              onSorting = {sortingHandler} 
              onFiltering = {filteringHandler}  
              onDateFiltering = {dateFilteringHandler}
              reviewsList = {loadedReviews} 
              onLoadMore={loadMoreReviews}
              highestRating = {highestRating} 
              lowestRating = {lowestRating} 
              />
              } 
          />
          <Route path='/statistics' element = {<StatisticsPage  />}/>
          <Route path='/reviewMedia/*' element = {<ReviewMediaPage  />}/>
        </Routes>
      </BrowserRouter>
    );
}

export default App;
