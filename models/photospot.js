const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    
    url: String,
    filename: String
    
})

//With the virtual schema we add parameters offered from Cloudinary
//to the image URL. In that case a parameter to create a Thumbnail
//With a virtual property we avoid saving it in the database.
//We do it on the fly. The new property is 'thumnail'
ImageSchema.virtual('thumbnail').get(function(){
   return  this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const PhotoSpotSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry:{
        type: {
            type: String,
            enum:['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

//With the virtual schema we add parameters offered from Cloudinary
//to the image URL. In that case a parameter to create a Thumbnail
//With a virtual property we avoid saving it in the database.
//We do it on the fly. Here we do it for the pop up in the Cluster Map
PhotoSpotSchema.virtual('properties.popUpMarkup').get(function(){
   //return  "I am PopUp text!"
   return `<strong><a href="/photospots/${this._id}">${this.title}</a></strong>
   <p>${this.description.substring(0, 40)}...</p>` 
 })
 

//Delete all reviews that can be found in a Photospot
PhotoSpotSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('PhotoSpot', PhotoSpotSchema);