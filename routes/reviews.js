const express = require('express');
const router = express.Router({ mergeParams: true });

//Import Controller / Routes
const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware');

//Importing routes
const photospots = require('../routes/photospots.js');

//Importing models
const PhotoSpot = require('../models/photospot');
const Review = require('../models/review');

//Error handling
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const ExpressErrorHandler = require('../utils/ExpressErrorHandler');

//Adding a review
router.post('/', isLoggedIn, validateReview, AsyncErrorHandler(reviews.createReview));

//Delete a review that belongs to a certain Photo Spot
// Google auch mal Pull. Pull entfernt eine Review aus dem Array von Reviews für einen Spot.
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, AsyncErrorHandler(reviews.deleteReview))

module.exports = router;