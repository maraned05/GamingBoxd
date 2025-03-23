import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage'; 

import './App.css';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  // const [loadedReviews, setLoadedReviews] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setIsLoading(true);
  //     const response = await fetch('http://localhost:5000/products');

  //     const responseData = await response.json();

  //     setLoadedReviews(responseData.products);
  //     setIsLoading(false);
  //   };

  //   fetchProducts();
  // }, []);

  // const addProductHandler = async (reviewTitle, reviewBody, reviewRating) => {
  //   try {
  //     const newProduct = {
  //       title: reviewTitle,
  //       body: reviewBody,
  //       rating: reviewRating
  //     };
  //     let hasError = false;
  //     const response = await fetch('http://localhost:5000/product', {
  //       method: 'POST',
  //       body: JSON.stringify(newProduct),
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       hasError = true;
  //     }

  //     const responseData = await response.json();

  //     if (hasError) {
  //       throw new Error(responseData.message);
  //     }

  //     setLoadedReviews(prevProducts => {
  //       return prevProducts.concat({
  //         ...newProduct,
  //         id: responseData.product.id
  //       });
  //     });
  //   } catch (error) {
  //     alert(error.message || 'Something went wrong!');
  //   }
  // };


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<MainPage />}/>
        <Route path='/statistics' element = {<StatisticsPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
