import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import StatisticsPage from './pages/StatisticsPage';
import { useConnectivityStatus } from './hooks/useConnectivityStatus';
import { BACKEND_URL } from './config';
import ReviewMediaPage from './pages/ReviewMediaPage';
import { queueOperation, syncPendingOperations } from './syncOperations';
import {formDataToSerializable, objectToFormData} from './formdataSerialization';
import { useAuth } from './contexts/AuthContext';
import { authService } from './services/authService';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TwoFactorSettings } from './pages/TwoFactorSettings';
import { TwoFactorVerification } from './pages/TwoFactorVerification';

function App() {
  const [loadedReviews, setLoadedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lowestRating, setLowestRating] = useState(null);
  const [highestRating, setHighestRating] = useState(null);

  const {isOnline, backendStatus} = useConnectivityStatus(BACKEND_URL);
  const { user, login, authHeader } = useAuth();
  
  // useEffect(() => {
  //   if (isOnline && backendStatus === 'ok')
  //     syncPendingOperations();
  //     // fetchReviews();
  //     // fetchHighestRating();
  //     // fetchLowestRating();
  //     // setNetworkFailed(false);
  // }, [isOnline, backendStatus]);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPaginatedReviews = async (page) => {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/reviews?page=${page}&limit=8`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader()
        }
      });
      const responseData = await response.json();

      if (responseData.reviews.length === 0) {
          setHasMore(false); 
      } else {
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
      if (user)
        fetchPaginatedReviews(currentPage);
  }, [currentPage]);

  const loadMoreReviews = () => {
    if (hasMore && !isLoading) {
        setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const fetchReviews = async () => {
      setIsLoading(true);
      try {
        let hasError = false;
        const response = await fetch(`${BACKEND_URL}/reviews`, {
          method: 'GET',
          headers: {
            ...authService.getAuthHeader()
          }
        });

        if (! response.ok)
            hasError = true;

        const responseData = await response.json();
        if (hasError)
            throw new Error(responseData.message);

        setLoadedReviews(responseData.reviews);
        setIsLoading(false);
      }
      catch (error) {
          alert(error.message);
      }
  };

  const fetchHighestRating = async () => {
    const response = await fetch(`${BACKEND_URL}/reviews/highestRating`, {
      method: 'GET',
      headers: {
        ...authService.getAuthHeader()
      }
    });
    const responseData = await response.json();
    setHighestRating(responseData.highestRating);
  };

  const fetchLowestRating = async () => {
    const response = await fetch(`${BACKEND_URL}/reviews/lowestRating`, {
      method: 'GET',
      headers: {
        ...authService.getAuthHeader()
      }
    });
    const responseData = await response.json();
    setLowestRating(responseData.lowestRating);
  };

  useEffect(() => { 
      if (user) {
        fetchReviews();
        fetchHighestRating();
        fetchLowestRating();
      }
  }, [user]);

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
      const response = await fetch(`${BACKEND_URL}/reviews`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader()
        },
        body: newProduct
      });

      if (!response.ok) {
        hasError = true;
      }
      const responseData = await response.json();

      if (hasError) {
        throw new Error(responseData.message);
      }

      console.log(responseData.review.id);
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
      const serializablePayload = await formDataToSerializable(newProduct);
      await queueOperation('create', serializablePayload);
      alert(error.message || 'Something went wrong!');
    }
};

  const editReviewHandler = async (reviewData) => {
      console.log("inside edit " + reviewData.id);
      try {
        let hasError = false;
        const response = await fetch(`${BACKEND_URL}/reviews/${reviewData.id}`, {
          method: 'PUT',
          body: JSON.stringify(reviewData),
          headers: {
            ...authService.getAuthHeader(),
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
        await queueOperation('update', reviewData);
        alert(error.message || 'Something went wrong!');
      }
  };

  const deleteReviewHandler = async (reviewID) => {
    try {
      let hasError = false;
      const response = await fetch(`${BACKEND_URL}/reviews/${reviewID}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeader()
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
        return prevReviews.filter(r => r.id !== responseData.reviewID);
      });
      fetchHighestRating();
      fetchLowestRating();
      
    }
    catch (error) {
        await queueOperation('delete', reviewID);
        alert(error.message || 'Something went wrong!');
    }
  }; 

  const sortingHandler = async (isSorted) => {
      setIsLoading(true);
      if (isSorted) {
        console.log('in sorted');
        const response = await fetch(`${BACKEND_URL}/reviews?sort=asc`, {
          method: 'GET',
          headers: {
            ...authService.getAuthHeader()
          }
        });
        const responseData = await response.json();
        setLoadedReviews(responseData.reviews);
      } 
      else {
        console.log('in not sorted');
        fetchReviews();
      } 
      setIsLoading(false);
  }; 

  const filteringHandler = async (textQuery) => {
    if (textQuery.trim() === "")
        fetchReviews(); 
    else {
      const response = await fetch(`${BACKEND_URL}/reviews?titleFilter=${textQuery}`, {
          method: 'GET',
          headers: {
            ...authService.getAuthHeader()
          }
        });
      const responseData = await response.json();
      setLoadedReviews(responseData.reviews);
    }
  };

  const dateFilteringHandler = async (textQuery) => {
    if (textQuery.trim() === "")
        fetchReviews();
    else {
      const response = await fetch(`${BACKEND_URL}/reviews?dateFilter=${textQuery}`, {
          method: 'GET',
          headers: {
            ...authService.getAuthHeader()
          }
        });
      const responseData = await response.json();
      setLoadedReviews(responseData.reviews);
    }
  };

  return (
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPage reviewsList = {loadedReviews} 
                  onAddReview = {addReviewHandler} 
                  onEditReview = {editReviewHandler} 
                  onDeleteReview = {deleteReviewHandler} 
                  onSorting = {sortingHandler} 
                  onFiltering = {filteringHandler}  
                  onDateFiltering = {dateFilteringHandler}
                  onLoadMore = {loadMoreReviews}
                  highestRating = {highestRating} 
                  lowestRating = {lowestRating} 
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/statistics"
            element={
              <StatisticsPage  />
            }
          />

          <Route
            path="/reviewMedia/*"
            element={
              <ProtectedRoute>
                <ReviewMediaPage  />
              </ProtectedRoute>
            }
          />

          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard  />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/login/2fa" 
            element={
                <ProtectedRoute>
                  <TwoFactorVerification  />
                </ProtectedRoute>
              } 
          />

          <Route 
            path="/settings/2fa" 
            element={
              <ProtectedRoute>
                  <TwoFactorSettings  />
                </ProtectedRoute>
              } 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
  );
}

export default App;
