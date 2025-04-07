// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import { v4 as uuidv4 } from 'uuid';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const { FRONTEND_URL } = require('./config');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

let REVIEWS = [];

app.use(bodyParser.json());

app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true
}));

//app.use("/media", express.static(path.join(__dirname, "uploads")));

io.on("connection", (socket) => {
  socket.emit("reviews:init", REVIEWS);
});

app.get('/media/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("File not found.");
    }
  });
});

app.get('/', (req, res, next) => {
  res.status(200).send("Backend is Working!");
});

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

app.post('/review', upload.single("media"), (req, res, next) => {
    const { title, body, rating, date } = req.body;
    const mediaFilename = req.file?.filename;

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
      media: mediaFilename,
      id: uuidv4(),
    };

    REVIEWS.push(createdReview);

    io.emit('review:new', createdReview);

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
        io.emit('review:updated', REVIEWS[index]);
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
        if (REVIEWS[index].media) {
            const filePath = path.join(__dirname, 'uploads', REVIEWS[index].media);
            if (fs.existsSync(filePath)) {
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error("Failed to delete file:", err);
                } else {
                  console.log("Deleted media file:", filePath);
                }
              });
            }
        }

        REVIEWS = REVIEWS.filter(r => r.id !== id);
        io.emit('review:deleted', id);
        res.status(200).json({ message: 'Deleted review.', reviewID: id});
    }
    else {
        return res.status(404).json({ message: 'Review not found' });
    }

});

module.exports = server;
