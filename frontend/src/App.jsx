import React, { useState, useEffect } from 'react';

import MainPage from './pages/MainPage'; 

import './App.css';

function App() {
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setIsLoading(true);
  //     const response = await fetch('http://localhost:5000/products');

  //     const responseData = await response.json();

  //     setLoadedProducts(responseData.products);
  //     setIsLoading(false);
  //   };

  //   fetchProducts();
  // }, []);

  // const addReviewHandler = async (productName, productPrice) => {
  //   const newReview = {
  //     title: productName,
  //     body: productPrice // "+" to convert string to number
  //   };

  //   setLoadedProducts(prevProducts => {
  //     return prevProducts.concat({
  //       ...newProduct});
  //   });
  // };

  return (
    <React.Fragment>
      <MainPage />
      {/* <Header />
      <main>
        <NewProduct onAddProduct={addProductHandler} />
        {isLoading && <p className="loader">Loading...</p>}
        {!isLoading && <ProductList items={loadedProducts} />}
      </main> */}
    </React.Fragment>
  );
}

export default App;
