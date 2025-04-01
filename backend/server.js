// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import { v4 as uuidv4 } from 'uuid';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const app = express();

let REVIEWS = [];

app.use(bodyParser.json());
app.use(cors());

app.get('/reviews', (req, res, next) => {
    res.status(200).json({ reviews: REVIEWS });
});

app.get('/reviews/lowestRating', (req, res, next) => {
    if (REVIEWS.length === 0 || REVIEWS.length === 1)
      res.status(200).json({ lowestRating: null });
    else res.status(200).json({ lowestRating: REVIEWS.reduce((min, review) => Math.min(min, review.rating), '5') });
});

app.get('/reviews/highestRating', (req, res, next) => {
    if (REVIEWS.length === 0 || REVIEWS.length === 1)
      res.status(200).json({ highestRating: null });
    else res.status(200).json({ highestRating: REVIEWS.reduce((max, review) => Math.max(max, review.rating), '1') });
});

app.get('/sortedReviews', (req, res, next) => {
    res.status(200).json({ sortedReviews: [...REVIEWS].sort(function (r1, r2) {return r1.rating - r2.rating; }) });
});

app.get('/filteredReviews/:textQuery', (req, res, next) => {
    const { textQuery } = req.params;
    res.status(200).json({ filteredReviews: [...REVIEWS].filter((review) => review.title.toLowerCase().includes(textQuery)) });
});

app.get('/filteredByDateReviews/:textQuery', (req, res, next) => {
  const { textQuery } = req.params;
  res.status(200).json({ filteredReviews: [...REVIEWS].filter((review) => review.date.includes(textQuery)) });
});

app.post('/review', (req, res, next) => {
    const { title, body, rating, date } = req.body;

    if (!title || title.trim().length === 0 || !body || body.trim().length === 0 || !rating || rating.trim().length === 0
        || !date || date.trim().length === 0) {

        return res.status(422).json({
        message: 'Invalid input, please enter a valid title, body, rating and date.'
      });
    }

    const createdReview = {
      title: title,
      body: body,
      rating: rating,
      date: date,
      id: uuidv4(),
    };

    console.log(createdReview.id);
    REVIEWS.push(createdReview);

    res
      .status(201)
      .json({ message: 'Created new review.', review: createdReview});
});

app.put('/review/:id', (req, res, next) => {
    const { title, body, rating, date } = req.body;
    const { id } = req.params;

    if (!title || title.trim().length === 0 || !body || body.trim().length === 0 || !rating || rating.trim().length === 0
        || !date || date.trim().length === 0) {

        return res.status(422).json({
        message: 'Invalid input, please enter a valid title, body, rating and date.'
      });
    }

    const index = REVIEWS.findIndex(review => review.id === id);
    if (index !== -1) {
        REVIEWS[index] = {title: title, body: body, rating: rating, date: date, id: id};
        res.status(200).json({ message: 'Updated review.', review: REVIEWS[index]});
    }
    else {
        return res.status(404).json({ message: 'Review not found' });
    }

});

app.delete('/review/:id', (req, res, next) => {
    const { id } = req.params;

    const index = REVIEWS.findIndex(review => review.id === id);
    if (index !== -1) {
        REVIEWS = REVIEWS.filter(r => r.id !== id);
        res.status(200).json({ message: 'Deleted review.', reviewID: id});
    }
    else {
        return res.status(404).json({ message: 'Review not found' });
    }

});

// app.listen(5000);
module.exports = app;
