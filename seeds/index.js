const mongoose = require('mongoose');
const PhotoSpot = require('../models/photospot');


mongoose.connect('mongodb://127.0.0.1:27017/photo-spot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Check if Database is running
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database is up and connected");
});

const seedDB = async () => {
    await PhotoSpot.deleteMany({});
    const p = new PhotoSpot({
        //Your User ID
        author: '6346f38ca159b4794d1fa163',
        title: 'New Photo', 
        image: 'images/beispiel.jpg',
        description: 'What a nice place',
        geometry:  {
            type:"Point",
            coordinates:[10.046702,53.566811]
        }
    })
    await p.save();
}

seedDB().then(() => {
    mongoose.connection.close();
});