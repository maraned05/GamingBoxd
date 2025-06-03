const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
// const { PrismaClient } = require('@prisma/client');
// const { PrismaClient } = require('../backend/generated/prisma/client');
const { PrismaClient } = require('./generated/prisma/client');
const { logActivity } = require('./utils/logActivity');
const { detectSuspiciousActivity } = require('./utils/monitorLogs');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const auth = require('./utils/auth')
const { sendVerificationEmail } = require('./utils/emailService');
const speakeasy = require('speakeasy');
uuidv4();

cron.schedule('*/1 * * * *', detectSuspiciousActivity);

const app = express();
app.use(bodyParser.json());
app.use(cors());

let REVIEWS = [];
const prisma = new PrismaClient();

// const options = {
//   key: fs.readFileSync('./ssl/server.key'),
//   cert: fs.readFileSync('./ssl/server.cert')
// };

// Statistics Page Socket
const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//       origin: FRONTEND_URL,
//       methods: ["GET", "POST", "PUT", "DELETE"]
//     }
// });
// io.on("connection", (socket) => {
//     socket.emit("reviews:init", REVIEWS);
// });

// Local Backup Storage for CRUD operations
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

app.get('/reviews', auth, async (req, res) => {
    const { page, limit, sort, titleFilter, dateFilter } = req.query;
    const username = req.user.username;
    const user = await prisma.user.findUnique({ 
        where: { username: username }, 
        select: {id: true}
    }); 
    let responseReviews = [];

    // Paginated Reviews
    if (page && limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);
    
      responseReviews = await prisma.review.findMany({
        where: {userId: user.id},
        skip,
        take
      });
    }

    // Sorted by Rating
    else if (sort) {
      if (sort !== "asc" && sort !== "desc")
        res.status(400).send("Invalid sorting request.");

      const orderBy = { rating: sort };
      responseReviews = await prisma.review.findMany({
        where: {userId: user.id},
        orderBy
      });
    }

    // Filtering by Game Title
    else if (titleFilter) {
      const where = { 
        title: {contains: titleFilter, mode: 'insensitive' }, 
        userId: user.id 
      };
      responseReviews = await prisma.review.findMany({ where });
    }

    // Filtering by Date Added
    else if (dateFilter) {
      const where = { 
        date: {contains: dateFilter},
        userId: user.id 
      };
      responseReviews = await prisma.review.findMany({ where });
    }

    else responseReviews = await prisma.review.findMany({ where: {userId: user.id} });

    res.status(200).json({ reviews: responseReviews });
});

app.get('/reviews/lowestRating', auth, async (req, res) => {
    const username = req.user.username;
    const user = await prisma.user.findUnique({ 
        where: { username: username }, 
        select: {id: true}
    }); 
    const reviews = await prisma.review.findMany({
      where: {userId: user.id}
    });
    if (reviews.length === 0 || reviews.length === 1)
      res.status(200).json({ lowestRating: null });
    else res.status(200).json({ lowestRating: reviews.reduce((min, review) => Math.min(min, review.rating), 5) });
});

app.get('/reviews/highestRating', auth, async (req, res) => {
    const username = req.user.username;
    const user = await prisma.user.findUnique({ 
        where: { username: username }, 
        select: {id: true}
    }); 
    const reviews = await prisma.review.findMany({
      where: {userId: user.id}
    });
    if (reviews.length === 0 || reviews.length === 1)
      res.status(200).json({ highestRating: null });
    else res.status(200).json({ highestRating: reviews.reduce((max, review) => Math.max(max, review.rating), 1) });
});

app.post('/reviews', upload.single("media"), auth, async (req, res) => {
    const username = req.user.username;
    const user = await prisma.user.findUnique({ 
        where: { username: username }, 
        select: { id: true }
    }); 
    const { title, body, rating, date } = req.body;
    const mediaFilename = req.file?.filename;

    if (!title || title.trim().length === 0 || !body || body.trim().length === 0 || !rating || rating.trim().length === 0
        || !date || date.trim().length === 0 ) {

        return res.status(422).json({
        message: 'Invalid input, please enter a valid title, body, rating and date.'
      });
    }

    const createdReview = await prisma.review.create({
      data: {
        id: uuidv4(),
        title, 
        body, 
        rating,
        media: mediaFilename,
        date,
        userId: user.id
      }
    });

    await logActivity(username, 'CREATE');
    //io.emit('review:new', createdReview);
    res.status(201).json({ message: 'Created new review.', review: createdReview});
});

app.put('/reviews/:id', auth, async (req, res) => {
    const username = req.user.username; 
    const { id } = req.params;
    const user = await prisma.user.findUnique({ 
        where: { username: username }, 
        select: {id: true}
    }); 
    const { title, body, rating, date } = req.body;

    if (!title || title.trim().length === 0 || !body || body.trim().length === 0 || !rating || rating.trim().length === 0
        || !date || date.trim().length === 0) {

        return res.status(422).json({
        message: 'Invalid input, please enter a valid title, body, rating and date.'
      });
    }

    try {
      const updatedReview = await prisma.review.update({
        where: { id: id, userId: user.id },
        data: { title, body, rating, date }
      });

      await logActivity(username, 'UPDATE');
      //io.emit('review:updated', updatedReview);
      res.status(200).json({ message: 'Updated review.', review: updatedReview });
    }
    catch (err) {
      console.log(err.message);
      return res.status(404).json({ message: 'Review not found' });
    }

});

app.delete('/reviews/:id', auth, async (req, res) => {
    const username = req.user.username; 
    const { id } = req.params;
    const user = await prisma.user.findUnique({ 
        where: { username: username }, 
        select: {id: true}
    }); 

    const reviewToBeDeleted = await prisma.review.findUnique({ where: { id: id, userId: user.id } });
    if (!reviewToBeDeleted)
      return res.status(404).json({ message: 'Review not found' });

    if (reviewToBeDeleted.media) {
        const filePath = path.join(__dirname, 'uploads', reviewToBeDeleted.media);
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

    await prisma.review.delete({ where: { id } });
    await logActivity(username, 'DELETE');
    //io.emit('review:deleted', id);
    res.status(200).json({ message: 'Deleted review.', reviewID: id});

});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username: username, password: password } });
    if (! user)
      return res.status(404).json({ message: 'Invalid credentials.' });
    else {
      if (user.twoFactorEnabled) {
          const verificationCode = speakeasy.totp({
                secret: user.twoFactorSecret,
                encoding: 'base32'
            });

          await sendVerificationEmail(user.email, verificationCode);

          const tempToken = jwt.sign(
            { userId: user.id, temp: true },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
          );
          res.status(200).json({ tempToken, requiresTwoFactor: true, message: '2FA required.'});
      }
      else {
          const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
          res.status(200).json({ token, message: 'User found.', userInfo: user});
      }
    }
});

app.post('/auth/register', async (req, res) => {
    const { email, username, password, role } = req.body;
    try {
        const response = await prisma.user.create({
          data: {
              id: uuidv4(),
              email,
              username,
              password,
              role
          }
        });

        const token = jwt.sign(
            { userId: response.id, username: response.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, message: 'User successfully added.', userInfo: response });
    }
    catch (error) {
        res.status(422).json({ message: 'There is an already existing user with the same email or username.' }); 
    }
});

app.post('/auth/enable-2fa', auth, async (req, res) => {
    try {
        const { userId } = req.user; // From auth middleware

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new secret
        const secret = speakeasy.generateSecret({
            length: 20
        });

        // Update user with new secret
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: secret.base32,
                twoFactorEnabled: true
            }
        });

        // // Send verification code
        // const verificationCode = speakeasy.totp({
        //     secret: secret.base32,
        //     encoding: 'base32'
        // });

        // await sendVerificationEmail(user.email, verificationCode);

        res.json({
            message: '2FA enabled. Please verify with the code sent to your email.',
            // secret: secret.base32
        });
    } catch (error) {
        res.status(500).json({ error: 'Error enabling 2FA' });
    }
});

app.post('/disable-2fa', auth, async (req, res) => {
    try {
        const { userId } = req.user; // From auth middleware
        // const { code } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current code before disabling
        // const isValid = speakeasy.totp.verify({
        //     secret: user.twoFactorSecret,
        //     encoding: 'base32',
        //     token: code,
        //     window: 1
        // });

        // if (!isValid) {
        //     return res.status(401).json({ error: 'Invalid verification code' });
        // }

        // Disable 2FA
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: null,
                twoFactorEnabled: false
            }
        });

        res.json({ message: '2FA disabled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error disabling 2FA' });
    }
});

app.post('/auth/verify-2fa', auth, async (req, res) => {
    try {
        const { code } = req.body;

        if (!req.user.temp) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify 2FA code
        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 1 // Allow 30 seconds clock skew
        });

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid verification code' });
        }

        // Generate final token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, userInfo: user });
      } catch (error) {
          res.status(500).json({ error: 'Error verifying 2FA' });
      }
});

app.get('/admin/monitoredUsers', auth, async (req, res) => {
    const username = req.user.username;
    const user = await prisma.user.findUnique({ 
      where: { username: username }
    }); 
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await prisma.monitoredUser.findMany({
      orderBy: { lastDetected: 'desc' }
    });
    res.status(200).json({ users: users });
});

app.get('/statisticalQuery', async (req, res) => {
    const stats = await prisma.review.groupBy({
      by: ['date'],
      _count: { rating: true },
      orderBy: { date: 'asc' },
    });
    
    res.status(200).json({ stats: users }); 
});

module.exports = server;
