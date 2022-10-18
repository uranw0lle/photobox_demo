//Importing models
const PhotoSpot = require('../models/photospot');
const Review = require('../models/review');

//Create Review Route
module.exports.createReview = async(req,res,) => {
    const photospot = await PhotoSpot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    photospot.reviews.push(review);
    await review.save();
    await photospot.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/photospots/${photospot._id}`);
}

//Delete Review Route
module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await PhotoSpot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been deleted');
    res.redirect(`/photospots/${id}`);
}