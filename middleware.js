const { photospotSchema, reviewSchema } = require('./schemas.js');

const ExpressErrorHandler = require('./utils/ExpressErrorHandler');
const PhotoSpot = require('./models/photospot');
const Review = require('./models/review');

//Wit this middleware we check if a user is logged in
//We can use it for all actions that are only allowed for
//registered users

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in for that');
        return res.redirect('/login');
    }
    next();
}

//Data Validation with Joi - Should work now. Test it
module.exports.validatePhotospot = (req, res, next) => {
    const { error } = photospotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressErrorHandler(msg, 400);
    } else {
        next();
    }
}

//Check for Owner Photo Spot
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const photospot = await PhotoSpot.findById(id);
    if(!photospot.author.equals(req.user._id)) {
        req.flash('error', "You don't have the permission for that");
        return res.redirect(`/photospots/${id}`);
    }

    next();
}

//Data validation of the review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressErrorHandler(msg, 400);
    } else {
        next();
    }
}

//Check for Owner of the Review
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have the permission for that");
        return res.redirect(`/photospots/${id}`);
    }

    next();
}