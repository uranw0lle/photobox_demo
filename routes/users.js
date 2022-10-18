const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');

//Group together identical routes
router.route('/register')
      .get(users.renderRegister)
      .post(AsyncErrorHandler(users.register))

router.route('/login')
      .get(users.renderLogin)
      .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login);

router.get('/logout', users.logout);

module.exports = router;