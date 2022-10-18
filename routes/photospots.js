const express = require('express');
const router = express.Router();
const { isLoggedIn, validatePhotospot, isAuthor } = require('../middleware.js');
//File Upload Gelöt
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//Mounting Controllers(routes)
const photospots = require('../controllers/photospots');

//Error handling
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const ExpressErrorHandler = require('../utils/ExpressErrorHandler');

//Group together identical routes
router.route('/')
      .get(AsyncErrorHandler(photospots.indexPage))
      //.post(isLoggedIn, AsyncErrorHandler(photospots.createPhotospot));
      .post(isLoggedIn, upload.array('image'), validatePhotospot, AsyncErrorHandler(photospots.createPhotospot))

//Neuen Photo Spot hinzufügen
router.get('/new', isLoggedIn, photospots.renderNewForm)

router.route('/:id')
      .get(AsyncErrorHandler(photospots.showPhotospot))
      .put(isLoggedIn, isAuthor, upload.array('image'), validatePhotospot, AsyncErrorHandler(photospots.updatePhotospot))
      .delete(isLoggedIn, isAuthor, AsyncErrorHandler(photospots.deletePhotospot))


router.get('/photospots', AsyncErrorHandler(photospots.indexPage))

//Edit a photospot, given bei a certain ID
//Google bei Zeiten mal das populate. Das habe ich nicht verstanden
//Die Reviews werden so an die Show page übergeben
router.get('/:id/edit', isLoggedIn, isAuthor, AsyncErrorHandler(photospots.editForm));

module.exports = router;