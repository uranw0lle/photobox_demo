//Image Cloud
const { cloudinary } = require('../cloudinary');
//Mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
//Models
const PhotoSpot = require('../models/photospot');

//Route to start 
module.exports.indexPage = async (req, res) => {
    const photospots = await PhotoSpot.find({});
    res.render('photospots/index', { photospots })

}

//Route to the form to add a new photo spot
module.exports.renderNewForm = (req, res) => {
    res.render('photospots/new');
};

//Route to create the new photo spot
module.exports.createPhotospot = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.photospot.location,
        limit: 1
    }).send();
    const photospot = new PhotoSpot(req.body.photospot);
    photospot.geometry = geoData.body.features[0].geometry;
    photospot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    photospot.author = req.user._id;
    await photospot.save();
    console.log(photospot);
    req.flash('success', 'Created a new Photo Spot');
    res.redirect(`/photospots/${photospot._id}`);
};

//Route to show a photo spot
module.exports.showPhotospot = async (req, res) => {
    //Find Photospot by ID and populate the author and all reviews from that author
    const photospot = await PhotoSpot.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!photospot) {
        req.flash('error', "Mmhhh ... it looks like this Photo Spot doesn't exist");
        return res.redirect('/photospots');
    }
    res.render('photospots/show', { photospot });
};

//Route to the edit form of a Photo Spot
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const photospot = await PhotoSpot.findById(id);
    if (!photospot) {
        req.flash('error', "Mmhhh ... it looks like this Photo Spot doesn't exist");
        return res.redirect('/photospots');
    }
    res.render('photospots/edit', { photospot });
}

//Send a Post request to update an entry
//And UPDATE the entry in the DB
module.exports.updatePhotospot = async (req, res) => {
    const { id } = req.params;
    const photospot = await PhotoSpot.findByIdAndUpdate(id, { ...req.body.photospot });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    photospot.images.push(...imgs);
    await photospot.save();

    //deleteImages comes from the edit form name. It's an array.
    //with "pull" we can get items out of it. It means:
    //Pull all images where the filename is in the deleteImages Array
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
           await cloudinary.uploader.destroy(filename);
        }
        await photospot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
    }

    req.flash('success', 'Successfully updated Photo Spot');
    res.redirect(`/photospots/${photospot._id}`);
}
//Route to delete a photo spot
module.exports.deletePhotospot = async (req, res) => {
    const { id } = req.params;
    await PhotoSpot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Photo Spot');
    res.redirect(`/photospots`);
 
}